// src/redux/slices/journalEntrySlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  date: '',
  accountName: '',
  debit: 0,
  credit: 0,
  description: '',
  error: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
};

const journalSlice = createSlice({
  name: 'journals',
  initialState,
  reducers: {
    setDate: (state, action) => {
      state.date = action.payload;
    },
    setAccountName: (state, action) => {
      state.accountName = action.payload;
    },
    setDebit: (state, action) => {
      state.debit = action.payload;
    },
    setCredit: (state, action) => {
      state.credit = action.payload;
    },
    setDescription: (state, action) => {
      state.description = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    resetForm: (state) => {
      state.date = '';
      state.accountName = '';
      state.debit = 0;
      state.credit = 0;
      state.description = '';
      state.error = null;
      state.status = 'idle';
    },
  },
});

export const { setDate, setAccountName, setDebit, setCredit, setDescription, setError, setStatus, resetForm } = journalSlice.actions;
export default journalSlice.reducer;
