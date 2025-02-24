// src/redux/balanceSheetSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  balanceSheet: [],
  filters: {
    date: '',
    business: ''
  }
};

const balanceSheetSlice = createSlice({
  name: 'balanceSheet',
  initialState,
  reducers: {
    setBalanceSheetFilters: (state, action) => {
      state.filters = action.payload;
    },
    setBalanceSheetData: (state, action) => {
      state.balanceSheet = action.payload;
    }
  }
});

export const { setBalanceSheetFilters, setBalanceSheetData } = balanceSheetSlice.actions;

export const fetchBalanceSheet = (filters) => async dispatch => {
  try {
    const response = await axios.get('/api/balanceSheet', { params: filters });
    dispatch(setBalanceSheetData(response.data));
  } catch (error) {
    console.error(error);
  }
};

export default balanceSheetSlice.reducer;
