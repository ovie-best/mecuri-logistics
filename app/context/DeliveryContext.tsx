import React, { createContext, useContext, useState, ReactNode } from "react";

interface Address {
  street: string;
  city: string;
  state: string;
  landmark?: string;
}

interface PackageDetails {
  type: string;
  category: string;
  value: string;
}

interface DeliveryInfo {
  pickupAddress: Address;
  dropoffAddress: Address;
  packageDetails: PackageDetails;
  orderId?: string;
}

interface DeliveryContextType {
  deliveryInfo: DeliveryInfo | null;
  setDeliveryInfo: (info: DeliveryInfo) => void;
  clearDeliveryInfo: () => void;
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(
  undefined
);

export const DeliveryProvider = ({ children }: { children: ReactNode }) => {
  const [deliveryInfo, setDeliveryInfoState] = useState<DeliveryInfo | null>(
    null
  );

  const setDeliveryInfo = (info: DeliveryInfo) => {
    setDeliveryInfoState(info);
  };

  const clearDeliveryInfo = () => {
    setDeliveryInfoState(null);
  };

  return (
    <DeliveryContext.Provider
      value={{ deliveryInfo, setDeliveryInfo, clearDeliveryInfo }}
    >
      {children}
    </DeliveryContext.Provider>
  );
};

export const useDeliveryContext = () => {
  const context = useContext(DeliveryContext);
  if (context === undefined) {
    throw new Error(
      "useDeliveryContext must be used within a DeliveryProvider"
    );
  }
  return context;
};
