// src/redux/slices/newAccountSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accountName: '',
  accountType: '',
  initialBalance: 0,
  error: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
};

const newAccountSlice = createSlice({
  name: 'newAccount',
  initialState,
  reducers: {
    setAccountName: (state, action) => {
      state.accountName = action.payload;
    },
    setAccountType: (state, action) => {
      state.accountType = action.payload;
    },
    setInitialBalance: (state, action) => {
      state.initialBalance = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    resetForm: (state) => {
      state.accountName = '';
      state.accountType = '';
      state.initialBalance = 0;
      state.error = null;
      state.status = 'idle';
    },
  },
});

export const { setAccountName, setAccountType, setInitialBalance, setError, setStatus, resetForm } = newAccountSlice.actions;
export default newAccountSlice.reducer;
