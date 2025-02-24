import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customerData: [],
};

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setCustomerData: (state, action) => {
      state.customerData = action.payload;
    }
  },
});

export const { setCustomerData } = customerSlice.actions;
export default customerSlice.reducer;