import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

export interface UserLocation {
  latitude: number;
  longitude: number;
  address: string;
  placeId?: string;
}

export interface DropOffLocation extends UserLocation {
  mainText?: string;
  secondaryText?: string;
}

export interface PackageDetails {
  type: string;
  category?: string;
  itemValue: string;
}

export interface DeliveryInfo {
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  dropOffAddress: string;
  dropOffLatitude: number;
  dropOffLongitude: number;
  packageDetails: PackageDetails;
}

interface LocationContextType {
  // Current user location
  currentLocation: UserLocation | null;
  setCurrentLocation: (location: UserLocation) => void;

  // Drop-off location
  dropOffLocation: DropOffLocation | null;
  setDropOffLocation: (location: DropOffLocation) => void;
  clearDropOffLocation: () => void;

  // Delivery info (NEW)
  deliveryInfo: DeliveryInfo | null;
  setDeliveryInfo: (info: DeliveryInfo) => void;
  clearDeliveryInfo: () => void;

  // Loading states
  isLoadingCurrentLocation: boolean;
  setIsLoadingCurrentLocation: (loading: boolean) => void;

  // Error handling
  locationError: string | null;
  setLocationError: (error: string | null) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<UserLocation | null>(
    null
  );
  const [dropOffLocation, setDropOffLocation] =
    useState<DropOffLocation | null>(null);
  const [deliveryInfo, setDeliveryInfoState] = useState<DeliveryInfo | null>(
    null
  );
  const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] =
    useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const clearDropOffLocation = useCallback(() => {
    setDropOffLocation(null);
  }, []);

  const setDeliveryInfo = useCallback((info: DeliveryInfo) => {
    setDeliveryInfoState(info);
  }, []);

  const clearDeliveryInfo = useCallback(() => {
    setDeliveryInfoState(null);
  }, []);

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        setCurrentLocation,
        dropOffLocation,
        setDropOffLocation,
        clearDropOffLocation,
        deliveryInfo,
        setDeliveryInfo,
        clearDeliveryInfo,
        isLoadingCurrentLocation,
        setIsLoadingCurrentLocation,
        locationError,
        setLocationError,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};

export default LocationProvider;
