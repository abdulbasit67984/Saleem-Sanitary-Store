// src/redux/chequeSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  cheques: [],
  selectedCheque: null
};

const chequeSlice = createSlice({
  name: 'cheques',
  initialState,
  reducers: {
    addCheque: (state, action) => {
      state.cheques.push(action.payload);
    },
    editCheque: (state, action) => {
      state.cheques = state.cheques.map(cheque =>
        cheque.id === action.payload.id ? action.payload : cheque
      );
    },
    deleteCheque: (state, action) => {
      state.cheques = state.cheques.filter(cheque => cheque.id !== action.payload);
    },
    setCheques: (state, action) => {
      state.cheques = action.payload;
    },
    setSelectedCheque: (state, action) => {
      state.selectedCheque = action.payload;
    }
  }
});

export const { addCheque, editCheque, deleteCheque, setCheques, setSelectedCheque } = chequeSlice.actions;

export const fetchCheques = () => async dispatch => {
  try {
    const response = await axios.get('/api/cheques');
    dispatch(setCheques(response.data));
  } catch (error) {
    console.error(error);
  }
};

export default chequeSlice.reducer;
