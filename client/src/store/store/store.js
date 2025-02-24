import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../slices/auth/authSlice';
import navItemsSlice from '../slices/navItems/navItemsSlice';
import productsSlice from '../slices/products/productsSlice';
import journalSlice from '../slices/accounting/journalSlice'
import ledgerSlice from '../slices/accounting/ledgerSlice'
import openingBalanceSlice from '../slices/accounting/openingBalanceSlice';
import adjustBalanceSlice from '../slices/accounting/adjustBalanceSlice';
import transactionEntrySlice from '../slices/accounting/transactionEntrySlice';
import incomeStatementSlice from '../slices/accounting/incomeStatementSlice';
import cashFlowSlice from '../slices/accounting/cashFlowSlice';
import newAccountSlice from '../slices/accounting/newAccountSlice';
import BalanceSheetSlice from '../slices/accounting/BalanceSheetSlice'
import partyCashItemsSlice from '../slices/accounting/partyCashItemSlice'
import dailyLedgerSlice from '../slices/accounting/dailyLedgerSlice'
import chequeSlice from '../slices/accounting/chequeSlice'
import accountsSlice from '../slices/accounting/accountSlice'
import accountActivitySlice from '../slices/accounting/accountsActivitySlice'
import customerSlice from '../slices/customer/customerSlice';
import supplierSlice from '../slices/supplier/supplierSlice';
import companySlice from '../slices/company/companySlice';
import billSlice from '../slices/bills/billSlice';
import categorySlice from "../slices/products/categorySlice"
import typeSlice from "../slices/products/typeSlice"
import invoiceSlice from "../slices/invoice/invoiceSlice"
import saleReturnSlice from '../slices/sales/saleReturnSlice'
import purchaseItemSlice from '../slices/purchase/purchaseItemSlice';
import purchaseReturnSlice from '../slices/purchase/purchaseReturnSlice'

const store = configureStore({
    reducer: {
        auth: authSlice,
        navItems: navItemsSlice,
        saleItems: productsSlice,
        journals: journalSlice,
        ledgers: ledgerSlice,
        openingBalance: openingBalanceSlice,
        adjustBalance: adjustBalanceSlice,
        transactionEntry: transactionEntrySlice,
        incomeStatement: incomeStatementSlice,
        cashFlow: cashFlowSlice,
        newAccount: newAccountSlice,
        accountActivity: accountActivitySlice,
        accounts: accountsSlice,
        balanceSheet: BalanceSheetSlice,
        cheques: chequeSlice,
        dailyLedgers: dailyLedgerSlice,
        partyCashItems: partyCashItemsSlice,
        customers: customerSlice,
        bills: billSlice,
        suppliers: supplierSlice,
        companies: companySlice,
        categories: categorySlice,
        types: typeSlice,
        invoice: invoiceSlice,
        saleReturn: saleReturnSlice,
        purchaseItem: purchaseItemSlice,
        purchaseReturn: purchaseReturnSlice,
    }
});

export default store;
