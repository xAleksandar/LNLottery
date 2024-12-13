import { create } from "zustand";

type UserState = {
  balance: number;
  setBalance: (status: number) => void;
};

const useUserStore = create<UserState>((set) => ({
  balance: 0,
  setBalance: (status) => set({ balance: status }),
}));

export default useUserStore;
