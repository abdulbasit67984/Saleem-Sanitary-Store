// src/redux/slices/openingBalanceSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accountId: '',
  openingBalance: 0,
  error: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
};

const openingBalanceSlice = createSlice({
  name: 'openingBalance',
  initialState,
  reducers: {
    setAccountId: (state, action) => {
      state.accountId = action.payload;
    },
    setOpeningBalance: (state, action) => {
      state.openingBalance = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    resetForm: (state) => {
      state.accountId = '';
      state.openingBalance = 0;
      state.error = null;
      state.status = 'idle';
    },
  },
});

export const { setAccountId, setOpeningBalance, setError, setStatus, resetForm } = openingBalanceSlice.actions;
export default openingBalanceSlice.reducer;
