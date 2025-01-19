import { create } from "zustand";

type UserState = {
  balance: number;
  setBalance: (status: number) => void;
  userId: string;
  setUserId: (status: string) => void;
};

const useUserStore = create<UserState>((set) => ({
  balance: 0,
  setBalance: (status) => set({ balance: status }),
  userId: "",
  setUserId: (status) => set({ userId: status }),
}));

export default useUserStore;
