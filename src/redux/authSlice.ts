import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { hasPermission, RoleName } from '@/utils/permissions';
import type { RootState } from './store';

export interface AuthUser {
  id: string;
  name: string;
  roles: RoleName[];
}

interface AuthState {
  user: AuthUser | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;

// ---------------- Selectors ----------------
export const selectUser = (state: RootState): AuthUser | null => state.auth.user;
export const selectRoles = (state: RootState): RoleName[] => state.auth.user?.roles ?? [];

export const selectHasPermission = (permission: string) => (state: RootState): boolean => {
  const roles = selectRoles(state);
  return hasPermission(roles, permission);
};

export default authSlice.reducer;
