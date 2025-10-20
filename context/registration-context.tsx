import React, { createContext, useContext, useState } from "react";

type Steps = {
  basicInfo: boolean;
  accountDetails: boolean;
  selfie: boolean;
  driverLicense: boolean;
  vehicleInfo: boolean;
  referral?: boolean;
};

type RegistrationContextType = {
  steps: Steps;
  setStep: (key: keyof Steps, value: boolean) => void;
  reset: () => void;
};

const defaultSteps: Steps = {
  basicInfo: false,
  accountDetails: false,
  selfie: false,
  driverLicense: false,
  vehicleInfo: false,
  referral: false,
};

const RegistrationContext = createContext<RegistrationContextType | undefined>(
  undefined
);

export const RegistrationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [steps, setSteps] = useState<Steps>(defaultSteps);

  const setStep = (key: keyof Steps, value: boolean) => {
    setSteps((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => setSteps(defaultSteps);

  return (
    <RegistrationContext.Provider value={{ steps, setStep, reset }}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const ctx = useContext(RegistrationContext);
  if (!ctx)
    throw new Error("useRegistration must be used within RegistrationProvider");
  return ctx;
};

export default RegistrationProvider;
