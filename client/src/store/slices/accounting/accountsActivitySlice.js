// src/redux/accountActivitySlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  accountActivity: []
};

const accountActivitySlice = createSlice({
  name: 'accountActivity',
  initialState,
  reducers: {
    setAccountActivity: (state, action) => {
      state.accountActivity = action.payload;
    }
  }
});

export const { setAccountActivity } = accountActivitySlice.actions;

export const fetchAccountActivity = (filters) => async dispatch => {
  try {
    const response = await axios.get('/api/accountActivity', { params: filters });
    dispatch(setAccountActivity(response.data));
  } catch (error) {
    console.error(error);
  }
};

export default accountActivitySlice.reducer;
