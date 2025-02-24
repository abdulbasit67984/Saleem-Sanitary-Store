import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  typeData: [],
};

const typeSlice = createSlice({
  name: 'types',
  initialState,
  reducers: {
    setTypeData: (state, action) => {
      state.typeData = action.payload;
    }
  },
});

export const { setTypeData } = typeSlice.actions;
export default typeSlice.reducer;