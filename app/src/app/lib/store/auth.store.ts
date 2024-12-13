import { create } from "zustand";
import { ApiService } from "../api/api";

type AuthState = {
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  setLoggedIn: (status: boolean) => void;
  setAuthLoading: (status: boolean) => void;
  checkAuth: () => Promise<string | null>;
};

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  isAuthLoading: true,
  setLoggedIn: (status) => set({ isLoggedIn: status }),
  setAuthLoading: (status) => set({ isAuthLoading: status }),
  checkAuth: async () => {
    const api = new ApiService();
    const response = await api.status();
    set({
      isLoggedIn: !!response,
      isAuthLoading: false,
    });

    return response ? response.id : null;
  },
}));

export default useAuthStore;
