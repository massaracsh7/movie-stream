import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isSignedIn: boolean;
  id: string;
}

const initialState: AuthState = {
  isSignedIn: false,
  id: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData(state, action: PayloadAction<AuthState>) {
      state.isSignedIn = action.payload.isSignedIn;
      state.id = action.payload.id;
    },
  },
});

export const { setAuthData } = authSlice.actions;
export default authSlice.reducer;
