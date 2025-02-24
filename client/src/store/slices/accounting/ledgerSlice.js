// src/redux/slices/ledgerSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ledgerEntries: [], // Array to hold ledger entries
  startDate: '',
  endDate: '',
  error: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
};

const ledgerSlice = createSlice({
  name: 'ledgers',
  initialState,
  reducers: {
    setLedgerEntries: (state, action) => {
      state.ledgerEntries = action.payload;
    },
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    resetForm: (state) => {
      state.ledgerEntries = [];
      state.startDate = '';
      state.endDate = '';
      state.error = null;
      state.status = 'idle';
    },
  },
});

export const { setLedgerEntries, setStartDate, setEndDate, setError, setStatus, resetForm } = ledgerSlice.actions;
export default ledgerSlice.reducer;
