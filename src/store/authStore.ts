import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCartStore } from './cartStore';

export type UserRole = 'customer' | 'restaurant' | 'rider';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Mock authentication - in real app, this would call an API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock: Find user by email (in real app, backend would validate and return user)
        const mockUsers = [
          { id: '1', email: 'customer@test.com', name: 'John Customer', role: 'customer' as UserRole },
          { id: '2', email: 'restaurant@test.com', name: 'Restaurant Owner', role: 'restaurant' as UserRole },
          { id: '3', email: 'rider@test.com', name: 'Delivery Rider', role: 'rider' as UserRole }
        ];
        
        const foundUser = mockUsers.find(u => u.email === email) || {
          id: '1',
          email,
          name: email.split('@')[0],
          role: 'customer' as UserRole
        };

        set({ user: foundUser, isAuthenticated: true });
        
        // Auto-redirect based on user role
        const redirectPaths = {
          customer: '/customer/home',
          restaurant: '/restaurant/dashboard',
          rider: '/rider/dashboard'
        };
        
        window.location.href = redirectPaths[foundUser.role];
      },

      signup: async (email: string, password: string, name: string, role: UserRole) => {
        // Mock signup - in real app, this would call an API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user: User = {
          id: '1',
          email,
          name,
          role
        };

        set({ user, isAuthenticated: true });
      },

      logout: () => {
        // Clear cart when logging out
        useCartStore.getState().clearCart();
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);