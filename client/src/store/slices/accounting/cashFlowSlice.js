// src/redux/slices/cashFlowSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  startDate: '',
  endDate: '',
  cashInflow: 0,
  cashOutflow: 0,
  netCashFlow: 0,
  error: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
};

const cashFlowSlice = createSlice({
  name: 'cashFlow',
  initialState,
  reducers: {
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    setCashInflow: (state, action) => {
      state.cashInflow = action.payload;
    },
    setCashOutflow: (state, action) => {
      state.cashOutflow = action.payload;
    },
    setNetCashFlow: (state, action) => {
      state.netCashFlow = action.payload;
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
      state.cashInflow = 0;
      state.cashOutflow = 0;
      state.netCashFlow = 0;
      state.error = null;
      state.status = 'idle';
    },
  },
});

export const { setStartDate, setEndDate, setCashInflow, setCashOutflow, setNetCashFlow, setError, setStatus, resetForm } = cashFlowSlice.actions;
export default cashFlowSlice.reducer;
