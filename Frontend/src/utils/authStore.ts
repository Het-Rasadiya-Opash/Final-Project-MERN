import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  admin: boolean;
}

interface AuthStore {
  currentUser: User | null;
  tokenExpiry: number | null;
  setCurrentUser: (newUser: User) => void;
  removeCurrentUser: () => void;
  checkTokenExpiry: () => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      tokenExpiry: null,
      setCurrentUser: (newUser) => {
        const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        set({ currentUser: newUser, tokenExpiry: expiry });
      },
      removeCurrentUser: () => set({ currentUser: null, tokenExpiry: null }),
      checkTokenExpiry: () => {
        const { tokenExpiry } = get();
        if (tokenExpiry && Date.now() > tokenExpiry) {
          set({ currentUser: null, tokenExpiry: null });
        }
      },
    }),
    { name: "auth-storage" },
  ),
);

setInterval(() => {
  useAuthStore.getState().checkTokenExpiry();
}, 60000); 
export default useAuthStore;