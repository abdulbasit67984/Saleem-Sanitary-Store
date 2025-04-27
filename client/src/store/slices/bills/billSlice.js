import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  billData: [],
  bill: {},
  billNo: ""
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
    setBillNo: (state, action) => {
      state.billNo = action.payload;
    },

  },
});

export const { setBillData, setBill, setBillNo } = billSlice.actions;
export default billSlice.reducer;