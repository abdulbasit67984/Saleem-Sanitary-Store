// src/redux/partyCashItemsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  partyCashItems: []
};

const partyCashItemsSlice = createSlice({
  name: 'partyCashItems',
  initialState,
  reducers: {
    setPartyCashItems: (state, action) => {
      state.partyCashItems = action.payload;
    }
  }
});

export const { setPartyCashItems } = partyCashItemsSlice.actions;

export const fetchPartyCashItems = (filters) => async dispatch => {
  try {
    const response = await axios.get('/api/partyCashItems', { params: filters });
    dispatch(setPartyCashItems(response.data));
  } catch (error) {
    console.error(error);
  }
};

export default partyCashItemsSlice.reducer;
