import { create } from "zustand";

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
    set({
      isAppLoading: false,
    });
    return result;
  },
}));

export default useAppStore;
