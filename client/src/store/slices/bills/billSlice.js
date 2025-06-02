import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  billData: [],
  bill: {},
  billNo: "",
  searchBillFilters: {
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    billType: [],
    customer: "",
    billStatus: [],
  }
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
    setSearchBillFilters: (state, action) => {
      state.searchBillFilters = action.payload;
    },


  },
});

export const { setBillData, setBill, setBillNo, setSearchBillFilters } = billSlice.actions;
export default billSlice.reducer;