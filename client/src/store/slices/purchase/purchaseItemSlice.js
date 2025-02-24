/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    searchQuery: "",
    vendorProducts: [],
    searchQueryProducts: [],
    selectedItems: [],
    billNo: "",
    date: new Date().toISOString(),
    vendor: "",
    totalQty: 0,
    flatDiscount: 0,
    totalAmount: 0,
    paidAmount: 0,
    description: '',
    previousBalance: 0,
    isPaid: "unpaid",
    productName: "",
    productCode: "",
    productQuantity: 1,
    productDiscount: 0,
    productPrice: 0,
    product: {},
    totalGrossAmount: 0,
    purchaseData: []
};

const purchaseItemSlice = createSlice({
    name: "purchaseItem",
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        setVendorProducts: (state, action) => {
            state.vendorProducts = action.payload;
        },
        setDescription: (state, action) => {
            state.description = action.payload;
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
        setVendor: (state, action) => {
            state.vendor = action.payload;
        },
        setBillNo: (state, action) => {
            state.billNo = action.payload;
        },
        setTotalQty: (state, action) => {
            state.totalQty = action.payload;
        },
        setFlatDiscount: (state, action) => {
            state.flatDiscount = action.payload;
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
            state.productPrice = action.payload;
        },
        setProduct: (state, action) => {
            state.product = action.payload;
        },
        setTotalGrossAmount: (state, action) => {
            state.totalGrossAmount = action.payload;
        },
        setPurchaseData: (state, action) => {
            state.purchaseData = action.payload;
        },
        clearPurchaseState: (state) => {
            state.searchQuery = "";
            state.searchQueryProducts = [];
            state.selectedItems = [];
            state.billNo = "";
            state.totalQty = 0;
            state.flatDiscount = 0;
            state.totalAmount = 0;
            state.paidAmount = 0;
            state.description = '';
            state.previousBalance = 0;
            state.isPaid = "unpaid";
            state.productName = "";
            state.productCode = "";
            state.productQuantity = 1;
            state.productDiscount = 0;
            state.productPrice = 0;
            state.product = {};
            state.totalGrossAmount = 0;
            state.vendor = ""
            state.vendorProducts = []
        }
    }
});

export const {
    setSearchQuery,
    setSearchQueryProducts,
    setVendorProducts,
    setSelectedItems,
    setBillNo,
    setVendor,
    setDate,
    setTotalQty,
    setFlatDiscount,
    setTotalAmount,
    setPaidAmount,
    setPreviousBalance,
    setIsPaid,
    setProductName,
    setProductCode,
    setProductQuantity,
    setProductDiscount,
    setProductPrice,
    setProduct,
    setTotalGrossAmount,
    setDescription,
    setPurchaseData,
    clearPurchaseState
} = purchaseItemSlice.actions;

export default purchaseItemSlice.reducer;
