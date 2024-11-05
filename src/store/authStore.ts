// store/authStore.ts
import { create } from "zustand";

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  setToken: (token) => {
    localStorage.setItem("token", token); // Guarda el token en localStorage
    set({ token });
  },
  logout: () => {
    localStorage.removeItem("token"); // Elimina el token de localStorage
    set({ token: null });
  },
}));

export default useAuthStore;
