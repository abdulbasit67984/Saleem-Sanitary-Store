import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

const initialState = {
  allProducts: [],
  searchQuery: '',
  searchQueryProducts: [],
  selectedItems: [],
  date: '',
  totalQty: 0,
  flatDiscount: '',
  totalGst: 0,
  totalAmount: 0,
  totalGrossAmount: 0,
  customerId: null,
  paidAmount: '',
  previousBalance: 0,
  isPaid: 'unpaid',

  productName: '',
  productCode: '',
  productQuantity: '',
  productDiscount: '',
  productPrice: '',
  productUnits: '',
  product: {},
  extraProducts: []

};

const productsSlice = createSlice({
  name: 'saleItems',
  initialState,
  reducers: {
    setAllProducts: (state, action) => {
      state.allProducts = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSearchQueryProducts: (state, action) => {
      state.searchQueryProducts = action.payload;
    },
    setSelectedItems: (state, action) => {
      state.selectedItems = action.payload;
    },
    setDate: (state, action) => {
      state.date = action.payload;
    },
    setTotalQty: (state, action) => {
      state.totalQty = action.payload;
    },
    setCustomer: (state, action) => {
      state.customerId = action.payload;
    },
    setTotalGrossAmount: (state, action) => {
      state.totalGrossAmount = action.payload;
    },
    setFlatDiscount: (state, action) => {
      state.flatDiscount = action.payload;
    },
    setTotalGst: (state, action) => {
      state.totalGst = action.payload;
    },
    setTotalAmount: (state, action) => {
      state.totalAmount = action.payload;
    },
    setPaidAmount: (state, action) => {
      state.paidAmount = action.payload;
    },
    setPreviousBalance: (state, action) => {
      state.previousBalance = action.payload;
    },
    setIsPaid: (state, action) => {
      state.isPaid = action.payload;
    },
    setProductName: (state, action) => {
      state.productName = action.payload;
    },
    setProductCode: (state, action) => {
      state.productCode = action.payload;
    },
    setProductQuantity: (state, action) => {
      state.productQuantity = action.payload;
    },
    setProductDiscount: (state, action) => {
      state.productDiscount = action.payload;
    },
    setProductPrice: (state, action) => {
      state.productPrice = action.payload || 0;
    },
    setProductUnits: (state, action) => {
      state.productUnits = action.payload;
    },
    setProduct: (state, action) => {
      state.product = action.payload;
    },
    setExtraProducts: (state, action) => {
      state.extraProducts = action.payload;
    },
    removeExtraItem: (state, action) => {
      const indexToRemove = action.payload; // Payload will be the index
      if (indexToRemove >= 0 && indexToRemove < state.extraProducts.length) {
        state.extraProducts.splice(indexToRemove, 1); // Immer allows this mutation
      }
    },
  },
});

export const {
  setAllProducts,
  setSearchQuery
  , setSearchQueryProducts
  , setSelectedItems
  , setDate
  , setTotalQty
  , setFlatDiscount
  , setTotalGst
  , setTotalAmount
  , setPaidAmount
  , setPreviousBalance
  , setIsPaid
  , setProductName
  , setProductCode
  , setProductQuantity
  , setProductDiscount
  , setProductPrice
  , setProduct,
  setTotalGrossAmount,
  setProductUnits,
  setCustomer,
  setExtraProducts,
  removeExtraItem
} = productsSlice.actions;
export default productsSlice.reducer;

// Selectors

// Select the allProducts array from the state
const selectAllProducts = (state) => state.saleItems.allProducts;

// Create a memoized selector for filtering products based on search query
export const selectFilteredProducts = createSelector(
  [selectAllProducts, (state) => state.saleItems.searchQuery],
  (allProducts, searchQuery) => {
    if (!searchQuery) return allProducts;
    return allProducts.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
);

// Selector to calculate total quantity of selected items
// export const selectTotalQty = createSelector(
//   (state) => state.saleItems.selectedItems,
//   (selectedItems) => selectedItems.reduce((total, item) => total + item.totalQty, 0)
// );

// Selector to compute total amount including discounts
// export const selectTotalAmountWithDiscount = createSelector(
//   (state) => state.saleItems.saleDetails,
//   (saleDetails) => {
//     const { totalAmount, flatDiscount } = saleDetails;
//     const discount = parseFloat(flatDiscount) || 0;
//     return totalAmount - (totalAmount * discount) / 100;
//   }
// );