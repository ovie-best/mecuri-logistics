import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";

// Types
interface LocationCoords {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface DropOffLocation extends LocationCoords {
  name: string;
}

interface DeliveryDetails {
  packageType: string;
  packageSpecify: string;
  cropOfCabinet: string;
  sourcingMode: string;
}

interface Courier {
  id: string;
  name: string;
  avatar?: string;
  rating?: number;
  phone?: string;
}

interface DeliveryContextType {
  currentLocation: LocationCoords | null;
  dropOffLocation: DropOffLocation | null;
  deliveryDetails: DeliveryDetails;
  selectedCourier: Courier | null;
  locationPermission: boolean;
  updateDropOffLocation: (location: DropOffLocation) => void;
  updateDeliveryDetails: (details: Partial<DeliveryDetails>) => void;
  updateSelectedCourier: (courier: Courier) => void;
  resetDelivery: () => void;
  getCurrentLocation: () => Promise<void>;
}

interface DeliveryProviderProps {
  children: ReactNode;
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(
  undefined
);

export const useDelivery = (): DeliveryContextType => {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error("useDelivery must be used within DeliveryProvider");
  }
  return context;
};

export const DeliveryProvider: React.FC<DeliveryProviderProps> = ({
  children,
}) => {
  const [currentLocation, setCurrentLocation] = useState<LocationCoords | null>(
    null
  );
  const [dropOffLocation, setDropOffLocation] =
    useState<DropOffLocation | null>(null);
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    packageType: "",
    packageSpecify: "",
    cropOfCabinet: "",
    sourcingMode: "",
  });
  const [selectedCourier, setSelectedCourier] = useState<Courier | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async (): Promise<void> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to use this app",
          [{ text: "OK" }]
        );
        setLocationPermission(false);
        return;
      }

      setLocationPermission(true);
      getCurrentLocation();
    } catch (error) {
      console.error("Error requesting location permission:", error);
      Alert.alert("Error", "Failed to request location permission");
    }
  };

  const getCurrentLocation = async (): Promise<void> => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      console.error("Error getting current location:", error);
      // Fallback to Benin City coordinates
      setCurrentLocation({
        latitude: 6.335,
        longitude: 5.6037,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const updateDropOffLocation = (location: DropOffLocation): void => {
    setDropOffLocation(location);
  };

  const updateDeliveryDetails = (details: Partial<DeliveryDetails>): void => {
    setDeliveryDetails((prev) => ({ ...prev, ...details }));
  };

  const updateSelectedCourier = (courier: Courier): void => {
    setSelectedCourier(courier);
  };

  const resetDelivery = (): void => {
    setDropOffLocation(null);
    setDeliveryDetails({
      packageType: "",
      packageSpecify: "",
      cropOfCabinet: "",
      sourcingMode: "",
    });
    setSelectedCourier(null);
  };

  const value: DeliveryContextType = {
    currentLocation,
    dropOffLocation,
    deliveryDetails,
    selectedCourier,
    locationPermission,
    updateDropOffLocation,
    updateDeliveryDetails,
    updateSelectedCourier,
    resetDelivery,
    getCurrentLocation,
  };

  return (
    <DeliveryContext.Provider value={value}>
      {children}
    </DeliveryContext.Provider>
  );
};
