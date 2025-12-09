import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const AUTH_TOKEN_KEY = '@mecuri_auth_token';
const USER_DATA_KEY = '@mecuri_user_data';
const USER_TYPE_KEY = '@mecuri_user_type';

export interface UserData {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  role: 'customer' | 'driver';
  [key: string]: any;
}

/**
 * Save authentication token to secure storage
 */
export const saveAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving auth token:', error);
    throw new Error('Failed to save authentication token');
  }
};

/**
 * Get authentication token from storage
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Save user data to storage
 */
export const saveUserData = async (userData: UserData): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
    throw new Error('Failed to save user data');
  }
};

/**
 * Get user data from storage
 */
export const getUserData = async (): Promise<UserData | null> => {
  try {
    const data = await AsyncStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Save user type (customer or merchant/driver)
 */
export const saveUserType = async (userType: 'customer' | 'merchant'): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_TYPE_KEY, userType);
  } catch (error) {
    console.error('Error saving user type:', error);
    throw new Error('Failed to save user type');
  }
};

/**
 * Get user type from storage
 */
export const getUserType = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(USER_TYPE_KEY);
  } catch (error) {
    console.error('Error getting user type:', error);
    return null;
  }
};

/**
 * Clear all authentication data from storage
 */
export const clearAuthData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY, USER_TYPE_KEY]);
  } catch (error) {
    console.error('Error clearing auth data:', error);
    throw new Error('Failed to clear authentication data');
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await getAuthToken();
    return token !== null;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};
