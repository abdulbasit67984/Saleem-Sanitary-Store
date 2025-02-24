import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  navItemCategoryData: [],
  activeFeatureIndex: null,
};

const navItemsSlice = createSlice({
  name: 'navItems',
  initialState,
  reducers: {
    setNavItemCategoryData: (state, action) => {
      state.navItemCategoryData = action.payload;
    },
    setActiveFeatureIndex: (state, action) => {
      state.activeFeatureIndex = action.payload.activeIndex;
    },
  },
});

export const { setNavItemCategoryData, setActiveFeatureIndex } = navItemsSlice.actions;
export default navItemsSlice.reducer;