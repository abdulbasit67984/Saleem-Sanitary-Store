import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  supplierData: [],
};

const supplierSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    setSupplierData: (state, action) => {
      state.supplierData = action.payload;
    }
  },
});

export const { setSupplierData } = supplierSlice.actions;
export default supplierSlice.reducer;