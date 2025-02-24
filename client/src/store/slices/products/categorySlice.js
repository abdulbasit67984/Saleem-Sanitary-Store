import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categoryData: [],
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategoryData: (state, action) => {
      state.categoryData = action.payload;
    }
  },
});

export const { setCategoryData } = categorySlice.actions;
export default categorySlice.reducer;