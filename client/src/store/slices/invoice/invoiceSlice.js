import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  products: [],
  totals: {
    gross: 0,
    discount: 0,
    gst: 0,
    net: 0,
  },
};

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    // Add a new product to the invoice
    addProduct: (state, action) => {
      const newProduct = { id: uuidv4(), ...action.payload };
      state.products.push(newProduct);
    },
    // Update product quantity
    updateProductQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const product = state.products.find((product) => product.id === id);
      if (product) {
        product.quantity = quantity;
      }
    },
    // Remove a product from the invoice
    removeProduct: (state, action) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
    },
    // Calculate totals based on products
    calculateTotals: (state) => {
      let gross = 0,
        discount = 0,
        gst = 0,
        net = 0;

      state.products.forEach((product) => {
        const productGross = product.price * product.quantity;
        const productDiscount = (productGross * product.discount) / 100;
        const productGst = ((productGross - productDiscount) * product.gst) / 100;
        const productNet = productGross - productDiscount + productGst;

        gross += productGross;
        discount += productDiscount;
        gst += productGst;
        net += productNet;
      });

      state.totals = { gross, discount, gst, net };
    },
    // Reset the invoice to its initial state
    resetInvoice: (state) => {
      state.products = [];
      state.totals = { gross: 0, discount: 0, gst: 0, net: 0 };
    },
  },
});

export const {
  addProduct,
  updateProductQuantity,
  removeProduct,
  calculateTotals,
  resetInvoice,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
