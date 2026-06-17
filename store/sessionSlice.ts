'use client';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface SessionState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  lastRoute: string | null;
}

const initialState: SessionState = {
  user: null,
  isAuthenticated: false,
  lastRoute: null,
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    setLastRoute(state, action: PayloadAction<string>) {
      state.lastRoute = action.payload;
    },
  },
});

export const { setUser, clearUser, setLastRoute } = sessionSlice.actions;
export default sessionSlice.reducer;
