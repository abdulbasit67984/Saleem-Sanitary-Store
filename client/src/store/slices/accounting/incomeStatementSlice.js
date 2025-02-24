// src/redux/slices/incomeStatementSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  startDate: '',
  endDate: '',
  revenue: 0,
  expenses: 0,
  netIncome: 0,
  error: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
};

const incomeStatementSlice = createSlice({
  name: 'incomeStatement',
  initialState,
  reducers: {
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    setRevenue: (state, action) => {
      state.revenue = action.payload;
    },
    setExpenses: (state, action) => {
      state.expenses = action.payload;
    },
    setNetIncome: (state, action) => {
      state.netIncome = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    resetForm: (state) => {
      state.startDate = '';
      state.endDate = '';
      state.revenue = 0;
      state.expenses = 0;
      state.netIncome = 0;
      state.error = null;
      state.status = 'idle';
    },
  },
});

export const { setStartDate, setEndDate, setRevenue, setExpenses, setNetIncome, setError, setStatus, resetForm } = incomeStatementSlice.actions;
export default incomeStatementSlice.reducer;
