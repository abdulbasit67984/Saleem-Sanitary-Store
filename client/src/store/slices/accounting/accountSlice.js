// src/redux/accountsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  accounts: [],
  selectedAccount: null
};

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    addAccount: (state, action) => {
      state.accounts.push(action.payload);
    },
    editAccount: (state, action) => {
      state.accounts = state.accounts.map(account =>
        account.id === action.payload.id ? action.payload : account
      );
    },
    deleteAccount: (state, action) => {
      state.accounts = state.accounts.filter(account => account.id !== action.payload);
    },
    setAccounts: (state, action) => {
      state.accounts = action.payload;
    },
    setSelectedAccount: (state, action) => {
      state.selectedAccount = action.payload;
    }
  }
});

export const { addAccount, editAccount, deleteAccount, setAccounts, setSelectedAccount } = accountsSlice.actions;

export const fetchAccounts = () => async dispatch => {
  try {
    const response = await axios.get('/api/accounts');
    dispatch(setAccounts(response.data));
  } catch (error) {
    console.error(error);
  }
};

export default accountsSlice.reducer;
