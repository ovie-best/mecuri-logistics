import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";
const USER_AGENT =
  "MecuriLogistics/1.0 (https://github.com/ovie-best/mecuri-logistics)";

// Cache configuration
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const SHORT_CACHE_EXPIRY = 2 * 60 * 60 * 1000; // 2 hours for reverse geocode

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const BACKOFF_MULTIPLIER = 2; // Exponential backoff

// Network timeout
const REQUEST_TIMEOUT = 10000; // 10 seconds (increased from 5s)

export interface LocationSuggestion {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText?: string;
  latitude?: number;
  longitude?: number;
  type?: string;
  displayName?: string;
}

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  address: string;
  placeId: string;
  displayName?: string;
}

interface CachedResult {
  data: LocationSuggestion[] | GeocodeResult;
  timestamp: number;
}

interface RetryConfig {
  attempt: number;
  maxRetries: number;
  delay: number;
}

class NominatimService {
  private abortController: AbortController | null = null;
  private cache: Map<string, CachedResult> = new Map();
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();
  private requestInProgress = false;
  private networkConnected = true;

  /**
   * Initialize cache from AsyncStorage on startup
   */
  async initializeCache(): Promise<void> {
    try {
      const cachedData = await AsyncStorage.getItem("nominatim_cache");
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        this.cache = new Map(Object.entries(parsed));
      }
      console.log("✅ Nominatim cache initialized. Entries:", this.cache.size);
    } catch (error) {
      console.error("Error loading cache from AsyncStorage:", error);
    }
  }

  /**
   * Save cache to AsyncStorage
   */
  private async persistCache(): Promise<void> {
    try {
      const cacheObj = Object.fromEntries(this.cache);
      await AsyncStorage.setItem("nominatim_cache", JSON.stringify(cacheObj));
    } catch (error) {
      console.error("Error persisting cache to AsyncStorage:", error);
    }
  }

  /**
   * Check if cached result is still valid
   */
  private isCacheValid(
    timestamp: number,
    expiryTime: number = CACHE_EXPIRY
  ): boolean {
    return Date.now() - timestamp < expiryTime;
  }

  /**
   * Delay execution for retry backoff
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: any): boolean {
    // Network errors are retryable
    if (
      error.code === "ECONNREFUSED" ||
      error.code === "ENOTFOUND" ||
      error.code === "ETIMEDOUT"
    ) {
      return true;
    }

    // Timeout errors are retryable
    if (error.code === "ECONNABORTED") {
      return true;
    }

    // Server errors (5xx) are retryable
    if (error.response?.status >= 500) {
      return true;
    }

    // Rate limiting (429) is retryable
    if (error.response?.status === 429) {
      return true;
    }

    return false;
  }

  /**
   * Get address predictions with retry logic
   */
  async getAddressPredictions(input: string): Promise<LocationSuggestion[]> {
    if (!input || input.trim().length < 2) {
      return [];
    }

    const cacheKey = `search:${input.toLowerCase()}`;

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && this.isCacheValid(cached.timestamp)) {
      console.log("📦 [Cache Hit]", input);
      return cached.data as LocationSuggestion[];
    }

    return this.getAddressPredictionsWithRetry(input, cacheKey);
  }

  /**
   * Get address predictions with retry mechanism
   */
  private async getAddressPredictionsWithRetry(
    input: string,
    cacheKey: string,
    retryConfig: RetryConfig = {
      attempt: 1,
      maxRetries: MAX_RETRIES,
      delay: RETRY_DELAY,
    }
  ): Promise<LocationSuggestion[]> {
    try {
      // Cancel previous request if it exists
      if (this.abortController) {
        this.abortController.abort();
      }

      this.abortController = new AbortController();
      this.requestInProgress = true;

      console.log(
        `🔍 [Nominatim Search] ${input} (Attempt ${retryConfig.attempt}/${retryConfig.maxRetries})`
      );

      const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
        params: {
          q: input.trim(),
          format: "json",
          addressdetails: 1,
          limit: 10,
          "accept-language": "en",
          countrycodes: "ng",
        },
        headers: {
          "User-Agent": USER_AGENT,
        },
        signal: this.abortController.signal,
        timeout: REQUEST_TIMEOUT,
      });

      this.requestInProgress = false;
      this.networkConnected = true;

      if (response.data && Array.isArray(response.data)) {
        const suggestions: LocationSuggestion[] = response.data.map(
          (result: any) => ({
            placeId: result.osm_id.toString(),
            description: result.display_name,
            mainText: this.extractMainText(result),
            secondaryText: this.extractSecondaryText(result),
            latitude: parseFloat(result.lat),
            longitude: parseFloat(result.lon),
            type: result.type,
            displayName: result.display_name,
          })
        );

        // Cache the results
        this.cache.set(cacheKey, {
          data: suggestions,
          timestamp: Date.now(),
        });

        await this.persistCache();

        console.log("✅ [Results]", suggestions.length, "locations found");
        return suggestions;
      }

      console.log("⚠️ [No Results] for:", input);
      return [];
    } catch (error: any) {
      // Silently ignore abort errors (expected during debouncing)
      if (error.code === "ECONNABORTED" || error.name === "CanceledError") {
        console.log("🔄 [Request Cancelled]");
        return [];
      }

      this.requestInProgress = false;

      // Check if error is retryable and we have retries left
      if (
        this.isRetryableError(error) &&
        retryConfig.attempt < retryConfig.maxRetries
      ) {
        console.warn(
          `⚠️ [Retry] Attempt ${retryConfig.attempt} failed. Retrying in ${retryConfig.delay}ms...`
        );

        // Wait before retrying (exponential backoff)
        await this.delay(retryConfig.delay);

        // Retry with increased delay
        return this.getAddressPredictionsWithRetry(input, cacheKey, {
          attempt: retryConfig.attempt + 1,
          maxRetries: retryConfig.maxRetries,
          delay: retryConfig.delay * BACKOFF_MULTIPLIER,
        });
      }

      // Log the error
      console.error("❌ [API Error]", error.message);
      this.networkConnected = false;

      return [];
    }
  }

  /**
   * Get place details with retry logic
   */
  async getPlaceDetails(placeId: string): Promise<GeocodeResult> {
    const cacheKey = `details:${placeId}`;

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && this.isCacheValid(cached.timestamp)) {
      console.log("📦 [Cache Hit] Place details:", placeId);
      return cached.data as GeocodeResult;
    }

    return this.getPlaceDetailsWithRetry(placeId, cacheKey);
  }

  /**
   * Get place details with retry mechanism
   */
  private async getPlaceDetailsWithRetry(
    placeId: string,
    cacheKey: string,
    retryConfig: RetryConfig = {
      attempt: 1,
      maxRetries: MAX_RETRIES,
      delay: RETRY_DELAY,
    }
  ): Promise<GeocodeResult> {
    try {
      console.log(
        `🔍 [Nominatim Details] ${placeId} (Attempt ${retryConfig.attempt}/${retryConfig.maxRetries})`
      );

      const response = await axios.get(`${NOMINATIM_BASE_URL}/details`, {
        params: {
          osm_id: placeId,
          format: "json",
          addressdetails: 1,
        },
        headers: {
          "User-Agent": USER_AGENT,
        },
        timeout: REQUEST_TIMEOUT,
      });

      this.networkConnected = true;

      if (response.data) {
        const result: GeocodeResult = {
          latitude: parseFloat(response.data.lat),
          longitude: parseFloat(response.data.lon),
          address:
            response.data.address?.display_name || response.data.display_name,
          placeId,
          displayName: response.data.display_name,
        };

        // Cache the result
        this.cache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
        });

        await this.persistCache();
        console.log("✅ [Details Retrieved]", result.address);
        return result;
      }

      throw new Error("No place details found");
    } catch (error: any) {
      // Check if error is retryable and we have retries left
      if (
        this.isRetryableError(error) &&
        retryConfig.attempt < retryConfig.maxRetries
      ) {
        console.warn(
          `⚠️ [Retry] Attempt ${retryConfig.attempt} failed. Retrying in ${retryConfig.delay}ms...`
        );

        await this.delay(retryConfig.delay);

        return this.getPlaceDetailsWithRetry(placeId, cacheKey, {
          attempt: retryConfig.attempt + 1,
          maxRetries: retryConfig.maxRetries,
          delay: retryConfig.delay * BACKOFF_MULTIPLIER,
        });
      }

      console.error("❌ [Details Error]", error.message);
      this.networkConnected = false;
      throw error;
    }
  }

  /**
   * Reverse geocode coordinates to get address with retry logic
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<string> {
    const cacheKey = `reverse:${latitude.toFixed(4)}:${longitude.toFixed(4)}`;

    // Check cache first (shorter expiry for reverse geocode)
    const cached = this.cache.get(cacheKey);
    if (cached && this.isCacheValid(cached.timestamp, SHORT_CACHE_EXPIRY)) {
      console.log("📦 [Cache Hit] Reverse geocode");
      return (cached.data as GeocodeResult).address;
    }

    return this.reverseGeocodeWithRetry(latitude, longitude, cacheKey);
  }

  /**
   * Reverse geocode with retry mechanism
   */
  private async reverseGeocodeWithRetry(
    latitude: number,
    longitude: number,
    cacheKey: string,
    retryConfig: RetryConfig = {
      attempt: 1,
      maxRetries: MAX_RETRIES,
      delay: RETRY_DELAY,
    }
  ): Promise<string> {
    try {
      console.log(
        `🔍 [Reverse Geocode] ${latitude.toFixed(4)}, ${longitude.toFixed(4)} (Attempt ${retryConfig.attempt}/${retryConfig.maxRetries})`
      );

      const response = await axios.get(`${NOMINATIM_BASE_URL}/reverse`, {
        params: {
          lat: latitude,
          lon: longitude,
          format: "json",
          addressdetails: 1,
          zoom: 18,
        },
        headers: {
          "User-Agent": USER_AGENT,
        },
        timeout: REQUEST_TIMEOUT,
      });

      this.networkConnected = true;

      if (response.data && response.data.display_name) {
        const address = response.data.display_name;

        // Cache the result
        const cacheData: GeocodeResult = {
          latitude,
          longitude,
          address,
          placeId: response.data.osm_id?.toString() || "",
        };

        this.cache.set(cacheKey, {
          data: cacheData,
          timestamp: Date.now(),
        });

        await this.persistCache();
        console.log("✅ [Address Retrieved]", address);
        return address;
      }

      throw new Error("No address found for these coordinates");
    } catch (error: any) {
      // Check if error is retryable and we have retries left
      if (
        this.isRetryableError(error) &&
        retryConfig.attempt < retryConfig.maxRetries
      ) {
        console.warn(
          `⚠️ [Retry] Attempt ${retryConfig.attempt} failed. Retrying in ${retryConfig.delay}ms...`
        );

        await this.delay(retryConfig.delay);

        return this.reverseGeocodeWithRetry(latitude, longitude, cacheKey, {
          attempt: retryConfig.attempt + 1,
          maxRetries: retryConfig.maxRetries,
          delay: retryConfig.delay * BACKOFF_MULTIPLIER,
        });
      }

      console.error("❌ [Reverse Geocode Error]", error.message);
      this.networkConnected = false;

      // Fallback: Try to get cached result even if expired
      const expiredCache = this.cache.get(cacheKey);
      if (expiredCache) {
        const fallbackAddress = (expiredCache.data as GeocodeResult).address;
        console.log("⚠️ [Using Cached Address]", fallbackAddress);
        return fallbackAddress;
      }

      // Final fallback: Return human-readable coordinates
      const fallback = this.generateFallbackAddress(latitude, longitude);
      console.log("⚠️ [Using Fallback Address]", fallback);
      return fallback;
    }
  }

  /**
   * Generate a fallback address from coordinates
   */
  private generateFallbackAddress(latitude: number, longitude: number): string {
    // Get general region names based on coordinates
    const getRegionName = (lat: number, lng: number): string => {
      // Nigeria coordinates mapping
      if (lat >= 6.2 && lat <= 6.4 && lng >= 5.5 && lng <= 5.7) {
        return "Benin City, Nigeria";
      }
      if (lat >= 6.4 && lat <= 6.6 && lng >= 3.3 && lng <= 3.5) {
        return "Lagos, Nigeria";
      }
      if (lat >= 8.8 && lat <= 9.2 && lng >= 7.3 && lng <= 7.5) {
        return "Abuja, Nigeria";
      }
      return "Nigeria";
    };

    const region = getRegionName(latitude, longitude);
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)} (${region})`;
  }

  /**
   * Extract main text from Nominatim result
   */
  private extractMainText(result: any): string {
    if (result.name) return result.name;
    const addressParts = result.display_name?.split(",") || [];
    return addressParts[0]?.trim() || result.display_name;
  }

  /**
   * Extract secondary text from Nominatim result
   */
  private extractSecondaryText(result: any): string | undefined {
    const addressParts = result.display_name?.split(",") || [];
    if (addressParts.length > 1) {
      return addressParts
        .slice(1, 3)
        .map((part: string) => part.trim())
        .join(", ");
    }
    return undefined;
  }

  /**
   * Debounced version of getAddressPredictions
   */
  debouncedGetAddressPredictions = (
    input: string
  ): Promise<LocationSuggestion[]> => {
    const key = "addressPredictions";

    // Clear existing timer
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key)!);
    }

    return new Promise((resolve) => {
      const timer = setTimeout(async () => {
        const results = await this.getAddressPredictions(input);
        resolve(results);
        this.debounceTimers.delete(key);
      }, 500);

      this.debounceTimers.set(key, timer);
    });
  };

  /**
   * Clear all caches
   */
  async clearCache(): Promise<void> {
    this.cache.clear();
    try {
      await AsyncStorage.removeItem("nominatim_cache");
      console.log("✅ Cache cleared");
    } catch (error) {
      console.error("Error clearing AsyncStorage cache:", error);
    }
  }

  /**
   * Cancel ongoing requests
   */
  cancelRequests(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.requestInProgress = false;
      console.log("🛑 [Requests Cancelled]");
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }

  /**
   * Check if currently connected to network
   */
  isNetworkConnected(): boolean {
    return this.networkConnected;
  }

  /**
   * Check if request is in progress
   */
  isRequestInProgress(): boolean {
    return this.requestInProgress;
  }
}

export default new NominatimService();
