// src/redux/dailyLedgerSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  dailyLedgers: []
};

const dailyLedgerSlice = createSlice({
  name: 'dailyLedgers',
  initialState,
  reducers: {
    setDailyLedgers: (state, action) => {
      state.dailyLedgers = action.payload;
    }
  }
});

export const { setDailyLedgers } = dailyLedgerSlice.actions;

export const fetchDailyLedgers = (filters) => async dispatch => {
  try {
    const response = await axios.get('/api/dailyLedgers', { params: filters });
    dispatch(setDailyLedgers(response.data));
  } catch (error) {
    console.error(error);
  }
};

export default dailyLedgerSlice.reducer;
