import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  companyData: [],
};

const companySlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    setCompanyData: (state, action) => {
      state.companyData = action.payload;
    }
  },
});

export const { setCompanyData } = companySlice.actions;
export default companySlice.reducer;