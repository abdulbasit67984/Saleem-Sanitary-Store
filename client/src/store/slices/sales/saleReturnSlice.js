import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedItems: [], // Products being returned
  returnType: 'direct', // 'direct' or 'againstBill'
  customer: null, // Customer ID (optional)
  billId: null, // Bill ID (required for 'againstBill')
  totalReturnAmount: 0, // Total amount for the return
  flatDiscount: 0, // Flat discount on the return
  returnReason: '', // Reason for the return
  isLoading: false, // Loading state
  error: null, // Error message
  bill: null
};

const saleReturnSlice = createSlice({
  name: 'saleReturn',
  initialState,
  reducers: {
    setSelectedItems: (state, action) => {
      state.selectedItems = action.payload;
    },
    setReturnType: (state, action) => {
      state.returnType = action.payload;
    },
    setCustomer: (state, action) => {
      state.customer = action.payload;
    },
    setBillId: (state, action) => {
      state.billId = action.payload;
    },
    setBill: (state, action) => {
      state.bill = action.payload;
    },
    setTotalReturnAmount: (state, action) => {
      state.totalReturnAmount = action.payload;
    },
    setFlatDiscount: (state, action) => {
      state.flatDiscount = action.payload;
    },
    setReturnReason: (state, action) => {
      state.returnReason = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetSaleReturn: (state) => {
      state.selectedItems = [];
      state.returnType = 'direct';
      state.customer = null;
      state.billId = null;
      state.bill = null;
      state.totalReturnAmount = 0;
      state.flatDiscount = 0;
      state.returnReason = '';
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setSelectedItems,
  setReturnType,
  setCustomer,
  setBillId,
  setBill,
  setTotalReturnAmount,
  setFlatDiscount,
  setReturnReason,
  setLoading,
  setError,
  resetSaleReturn,
} = saleReturnSlice.actions;

export default saleReturnSlice.reducer;