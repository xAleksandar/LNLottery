import { create } from "zustand";
import useUserStore from "./user.store";

type AppState = {
  isAppLoading: boolean;
  setAppLoading: (status: boolean) => void;
  checkInitialState: (
    checkAuth: () => Promise<string | null>
  ) => Promise<string | null>;
};

const useAppStore = create<AppState>((set) => ({
  isAppLoading: true,
  setAppLoading: (status) => set({ isAppLoading: status }),
  checkInitialState: async (
    checkAuth: () => Promise<string | null>
  ): Promise<string | null> => {
    const result = await checkAuth();

    // Update userId in user store
    const setUserId = useUserStore.getState().setUserId;
    setUserId(result || "");

    set({
      isAppLoading: false,
    });
    return result;
  },
}));

export default useAppStore;
