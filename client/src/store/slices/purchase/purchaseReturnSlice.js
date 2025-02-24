import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedItems: [],
  vendorSupplier: '',
  vendorCompany: '',
  totalReturnAmount: 0,
  returnReason: '',
};

const purchaseReturnSlice = createSlice({
  name: 'purchaseReturn',
  initialState,
  reducers: {
    setSelectedItems: (state, action) => {
      state.selectedItems = action.payload;
    },
    setVendorSupplier: (state, action) => {
      state.vendorSupplier = action.payload;
      state.vendorCompany = ''; // Reset company when supplier is selected
    },
    setVendorCompany: (state, action) => {
      state.vendorCompany = action.payload;
      state.vendorSupplier = ''; // Reset supplier when company is selected
    },
    setTotalReturnAmount: (state, action) => {
      state.totalReturnAmount = action.payload;
    },
    setReturnReason: (state, action) => {
      state.returnReason = action.payload;
    },
    resetPurchaseReturn: () => initialState,
  },
});

export const {
  setSelectedItems,
  setVendorSupplier,
  setVendorCompany,
  setTotalReturnAmount,
  setReturnReason,
  resetPurchaseReturn,
} = purchaseReturnSlice.actions;

export default purchaseReturnSlice.reducer;
