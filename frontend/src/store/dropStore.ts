import { create } from "zustand";
import apiClient from "../api/client";

export type RecentBuyer = {
  username: string;
  userId: string;
  purchasedAt: string;
};

export type Drop = {
  id: string;
  name: string;
  totalStock: number;
  availableStock: number;
  startTime: string;
  stockVersion: number;
  updatedAt: string;
  recentBuyers: RecentBuyer[];
};

type DropPayload = Omit<Drop, "availableStock" | "recentBuyers"> & {
  availableStock?: number;
  available?: number;
  recentBuyers?: RecentBuyer[];
};

type DropStore = {
  drops: Drop[];
  loading: boolean;
  error: string | null;
  fetchDrops: () => Promise<void>;
  updateStock: (
    dropId: string,
    availableStock: number | undefined,
    stockVersion: number,
    totalStock?: number,
  ) => void;
  addRecentBuyer: (dropId: string, buyer: RecentBuyer) => void;
};

export const useDropStore = create<DropStore>((set) => ({
  drops: [],
  loading: false,
  error: null,

  fetchDrops: async () => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.get("/drops");
      const drops = res.data.map((drop: DropPayload) => ({
        ...drop,
        availableStock: drop.availableStock ?? drop.available ?? 0,
        recentBuyers: drop.recentBuyers ?? [],
      }));
      set({ drops, loading: false });
    } catch {
      set({ error: "Failed to load drops", loading: false });
    }
  },

  // Called by WebSocket stock-updated event
  updateStock: (dropId, availableStock, stockVersion, totalStock?) => {
    if (availableStock === undefined) return;

    set((state) => ({
      drops: state.drops.map((d) =>
        d.id === dropId
          ? {
              ...d,
              availableStock,
              stockVersion,
              ...(totalStock !== undefined && { totalStock }),
            }
          : d,
      ),
    }));
  },

  // Called by WebSocket purchase-completed event
  addRecentBuyer: (dropId, buyer) => {
    set((state) => ({
      drops: state.drops.map((d) =>
        d.id === dropId
          ? { ...d, recentBuyers: [buyer, ...d.recentBuyers].slice(0, 3) }
          : d,
      ),
    }));
  },
}));
