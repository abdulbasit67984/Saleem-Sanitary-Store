import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  billData: [],
  bill: {}
};

const billSlice = createSlice({
  name: 'bills',
  initialState,
  reducers: {
    setBillData: (state, action) => {
      state.billData = action.payload;
    },
    setBill: (state, action) => {
      state.bill = action.payload;
    },

  },
});

export const { setBillData, setBill } = billSlice.actions;
export default billSlice.reducer;