import { create } from "zustand";
import apiClient from "../api/client";

export type User = {
  id: string;
  username: string;
};

type UserStore = {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  fetchUsers: () => Promise<void>;
  setCurrentUser: (user: User) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  currentUser: null,
  loading: false,

  fetchUsers: async () => {
    set({ loading: true });
    try {
      const res = await apiClient.get("/users");
      const users: User[] = res.data;
      set({
        users,
        // Auto-select first user for demo convenience
        currentUser: users.length > 0 ? users[0] : null,
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },

  setCurrentUser: (user) => set({ currentUser: user }),
}));
