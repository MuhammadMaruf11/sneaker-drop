import { useState } from "react";
import apiClient from "../api/client";
import { useUserStore } from "../store/userStore";

type Reservation = {
  id: string;
  dropId: string;
  expiresAt: string;
  status: string;
};

type ReservationState = {
  reservation: Reservation | null;
  isReserving: boolean;
  isPurchasing: boolean;
  purchased: boolean;
  error: string | null;
  reserve: (dropId: string) => Promise<void>;
  completePurchase: () => Promise<void>;
  clearError: () => void;
  clearReservation: () => void;
};

export function useReservation(): ReservationState {
  const currentUser = useUserStore((s) => s.currentUser);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [isReserving, setIsReserving] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reserve = async (dropId: string) => {
    if (!currentUser) {
      setError("Please select a user first");
      return;
    }
    setIsReserving(true);
    setError(null);
    try {
      const res = await apiClient.post("/reservations", {
        userId: currentUser.id,
        dropId,
      });
      setReservation(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to reserve. Try again.");
    } finally {
      setIsReserving(false);
    }
  };

  const completePurchase = async () => {
    if (!currentUser || !reservation) return;
    setIsPurchasing(true);
    setError(null);
    try {
      await apiClient.post("/purchases", {
        userId: currentUser.id,
        reservationId: reservation.id,
      });
      setPurchased(true);
      setReservation(null);
    } catch (err: any) {
      const msg = err.response?.data?.error || "Purchase failed";
      setError(msg);
      if (msg.toLowerCase().includes("expir")) {
        setReservation(null);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  return {
    reservation,
    isReserving,
    isPurchasing,
    purchased,
    error,
    reserve,
    completePurchase,
    clearError: () => setError(null),
    clearReservation: () => setReservation(null),
  };
}
