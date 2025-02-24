// src/redux/slices/transactionEntrySlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accountId: '',
  amount: 0,
  type: '',
  error: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
};

const transactionEntrySlice = createSlice({
  name: 'transactionEntry',
  initialState,
  reducers: {
    setAccountId: (state, action) => {
      state.accountId = action.payload;
    },
    setAmount: (state, action) => {
      state.amount = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    resetForm: (state) => {
      state.accountId = '';
      state.amount = 0;
      state.type = '';
      state.error = null;
      state.status = 'idle';
    },
  },
});

export const { setAccountId, setAmount, setType, setError, setStatus, resetForm } = transactionEntrySlice.actions;
export default transactionEntrySlice.reducer;
