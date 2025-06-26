import { create } from 'zustand';
import type { User } from '../types';

const USERS_KEY = 'rca_users';

function loadUsers(): User[] {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  users: User[];
  register: (user: User) => { success: boolean; error?: string };
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  users: loadUsers(),
  register: (newUser) => {
    const users = get().users;
    if (users.some(u => u.email === newUser.email)) {
      return { success: false, error: 'El email ya está registrado.' };
    }
    const updated = [...users, newUser];
    set({ users: updated });
    saveUsers(updated);
    return { success: true };
  },
  login: (email, password) => {
    const user = get().users.find(u => u.email === email && u.password === password);
    if (!user) {
      return { success: false, error: 'Credenciales incorrectas o usuario no registrado.' };
    }
    set({ user, isAuthenticated: true });
    return { success: true };
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}));