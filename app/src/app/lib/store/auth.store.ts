import { create } from "zustand";
import { ApiService } from "../api/api";
import { ApiStatus } from "../api/status";

type AuthState = {
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  isEmailVerified: boolean;
  setLoggedIn: (status: boolean) => void;
  setAuthLoading: (status: boolean) => void;
  checkAuth: () => Promise<string | null>;
};

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  isAuthLoading: true,
  isEmailVerified: false,
  setLoggedIn: (status) => set({ isLoggedIn: status }),
  setAuthLoading: (status) => set({ isAuthLoading: status }),
  checkAuth: async () => {
    const api = new ApiService();
    const response = await api.status();

    set({
      isLoggedIn: !!response,
      isAuthLoading: false,
      isEmailVerified: response !== ApiStatus.EmailNotVerified,
    });

    return response ? response.id : null;
  },
}));

export default useAuthStore;
