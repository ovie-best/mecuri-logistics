// stores/DeliveryStore.ts
import { create } from "zustand";

type DeliveryStatus =
  | "IDLE"
  | "INCOMING"
  | "GO_TO_PICKUP"
  | "ARRIVED_PICKUP"
  | "GO_TO_DROPOFF"
  | "PAYMENT"
  | "COMPLETED";

interface Job {
  id: string;
  merchant: string;
  pickupAddress: string;
  dropoffAddress: string;
  amount: number;
  customerName: string;
  customerPhoto: string; // URI
  distance: number;
  time: number;
}

interface DeliveryState {
  status: DeliveryStatus;
  job: Job | null;
  online: boolean;
  setOnline: (online: boolean) => void;
  receiveJob: (job: Job) => void;
  acceptJob: () => void;
  declineJob: () => void;
  arriveAtPickup: () => void;
  pickupPackage: () => void;
  arriveAtDropoff: () => void;
  requestPayment: () => void;
  completePayment: () => void;
}

export const useDeliveryStore = create<DeliveryState>((set) => ({
  status: "IDLE",
  job: null,
  online: false,
  setOnline: (online) => set({ online }),
  receiveJob: (job) => set({ status: "INCOMING", job }),
  acceptJob: () => set({ status: "GO_TO_PICKUP" }),
  declineJob: () => set({ status: "IDLE", job: null }),
  arriveAtPickup: () => set({ status: "ARRIVED_PICKUP" }),
  pickupPackage: () => set({ status: "GO_TO_DROPOFF" }),
  arriveAtDropoff: () => set({ status: "PAYMENT" }),
  requestPayment: () => {
    // Mock payment request
    setTimeout(() => set({ status: "COMPLETED" }), 3000);
  },
  completePayment: () => set({ status: "IDLE", job: null }),
}));

// Mock incoming job (call this when online)
export function mockIncomingJob() {
  const store = useDeliveryStore.getState();
  if (store.online && store.status === "IDLE") {
    const mockJob: Job = {
      id: "123",
      merchant: "Nadia Bakery, Ugbowo",
      pickupAddress: "101 Benin City, Nigeria",
      dropoffAddress: "Union Road, Benin City, Nigeria",
      amount: 2500,
      customerName: "Osemudiamen",
      customerPhoto: "https://example.com/photo.jpg",
      distance: 4.2,
      time: 10,
    };
    store.receiveJob(mockJob);
  }
}
