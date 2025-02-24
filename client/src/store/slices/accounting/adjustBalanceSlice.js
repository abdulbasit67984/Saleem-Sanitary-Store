// src/redux/slices/adjustBalanceSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accountId: '',
  adjustedAmount: 0,
  error: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
};

const adjustBalanceSlice = createSlice({
  name: 'adjustBalance',
  initialState,
  reducers: {
    setAccountId: (state, action) => {
      state.accountId = action.payload;
    },
    setAdjustedAmount: (state, action) => {
      state.adjustedAmount = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    resetForm: (state) => {
      state.accountId = '';
      state.adjustedAmount = 0;
      state.error = null;
      state.status = 'idle';
    },
  },
});

export const { setAccountId, setAdjustedAmount, setError, setStatus, resetForm } = adjustBalanceSlice.actions;
export default adjustBalanceSlice.reducer;
