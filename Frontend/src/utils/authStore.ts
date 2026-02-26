import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  _id: string;
  username: string;
  email: string;
}

interface AuthStore {
  currentUser: User | null;
  setCurrentUser: (newUser: User) => void;
  removeCurrentUser: () => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      currentUser: null,
      setCurrentUser: (newUser) => set({ currentUser: newUser }),
      removeCurrentUser: () => set({ currentUser: null }),
    }),
    { name: "auth-storage" }
  )
);

export default useAuthStore;
