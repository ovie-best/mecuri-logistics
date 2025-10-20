import React, { createContext, ReactNode, useContext, useState } from "react";

// Define Ride type

export interface Ride {
  id: string;
  customer: string;
  pickupLocation: string;
  dropoffLocation: string;
  amount: string;
  distance: string;
  time: string;
  customerRating: number;
}

// Define RideStatus type
type RideStatus =
  | "idle"
  | "offer"
  | "accepted"
  | "pickup"
  | "dropoff"
  | "completed";

// Define context value type
interface RideContextType {
  isOnline: boolean;
  setIsOnline: (status: boolean) => void;
  hasNotification: boolean;
  setHasNotification: (status: boolean) => void;
  currentRide: Ride | null;
  rideStatus: RideStatus;
  acceptRide: (ride: Ride) => void;
  declineRide: () => void;
  markArrived: () => void;
  startDropoff: () => void;
  completeRide: () => void;
  resetRide: () => void;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export const useRide = (): RideContextType => {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error("useRide must be used within a RideProvider");
  }
  return context;
};

interface RideProviderProps {
  children: ReactNode;
}

export const RideProvider: React.FC<RideProviderProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [hasNotification, setHasNotification] = useState<boolean>(false);
  const [currentRide, setCurrentRide] = useState<Ride | null>(null);
  const [rideStatus, setRideStatus] = useState<RideStatus>("idle");

  const acceptRide = (ride: Ride) => {
    setCurrentRide(ride);
    setRideStatus("accepted");
    setHasNotification(false);
  };

  const declineRide = () => {
    setHasNotification(false);
    setRideStatus("idle");
  };

  const markArrived = () => {
    setRideStatus("pickup");
  };

  const startDropoff = () => {
    setRideStatus("dropoff");
  };

  const completeRide = () => {
    setRideStatus("completed");
  };

  const resetRide = () => {
    setCurrentRide(null);
    setRideStatus("idle");
  };

  const value: RideContextType = {
    isOnline,
    setIsOnline,
    hasNotification,
    setHasNotification,
    currentRide,
    rideStatus,
    acceptRide,
    declineRide,
    markArrived,
    startDropoff,
    completeRide,
    resetRide,
  };

  return <RideContext.Provider value={value}>{children}</RideContext.Provider>;
};

export default RideProvider;
