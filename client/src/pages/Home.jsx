/* eslint-disable no-unused-vars */
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  FeaturesCategory,
  //sales
  InvoiceComponent,
  SaleReturnAgainstBill,
  DirectSaleReturn,
  SoldItems,
  SaleReports,
  AddCustomer,
  Mycustomers,
  AccountsReceivables,
  BillPayment,
  MergeBills,

  //purchase

  PurchaseItem,
  AddSupplier,
  MySuppliers,
  AddCompany,
  MyCompanies,
  AddItemCategory,
  AddItemType,
  PurchaseReport,
  PurchaseReturn,

  //stock
  StockRegistration,
  StockIncrease,
  StockDecrease,
  StockReport,
  ChangedPriceReport,
  StockSearch,
  ShortItemList,
  ExpiryReport,
  //accounts
  DailyReport,
  Posting,
  OpeningAndAdjustmentBalance,
  ExpenseEntry,
  NewAccount,
  Ledger,
  VendorJournalEntry,
  CustomerJournalEntry,
  IncomeStatement,
  MergeAccounts,

  //users
  AddUser,
  AllUsers,
  Rights
}
  from '../components/index.js';
import MagicUiAnimation from '../components/magicUI/MagicUiAnimation.jsx';
import Journal from '../components/homePageComponents/accounts/VendorJournalEntry.jsx';
import ViewBill from '../components/homePageComponents/sales/bills/ViewBill.jsx';
import PrintBill from '../components/homePageComponents/sales/bills/PrintBill.jsx';
import BarcodePrinting from '../components/homePageComponents/stock/BarcodePrinting.jsx';


function Home() {
  const location = useLocation();
  const { billId } = useParams()

  const renderActiveFeature = () => {

    const pathParts = location.pathname.split('/');

    switch (pathParts[2]) {
      case 'sales':
        switch (pathParts[3]) {
          case 'sale-item-invoice':
            return <InvoiceComponent />;
          case 'sale-return-against-bill':
            return <SaleReturnAgainstBill />;
          case 'direct-sale-return':
            return <DirectSaleReturn />;
          case 'sold-item':
            return <SoldItems />;
          case 'sale-reports':
            return <SaleReports />;
          // case 'view-bills':
          //   return <PrintBill />;
          case 'add-customer':
            return <AddCustomer />;
          case 'my-customers':
            return <Mycustomers />;
          case 'account-receivables':
            return <AccountsReceivables />;
          case 'bill-payment':
            return <BillPayment billId={billId} />;
          case `view-bill`:
            return <PrintBill />;
          case `merge-bills`:
            return <MergeBills />;
          default:
            return <MagicUiAnimation text='Sales Management' />;
        }
      case 'stock':
        switch (pathParts[3]) {
          case 'registration':
            return <StockRegistration />;
          case 'stock-increase':
            return <StockIncrease />;
          case 'stock-decrease':
            return <StockDecrease />;
          case 'stock-report':
            return <StockReport />;
          case 'add-item-category':
            return <AddItemCategory />;
          case 'add-item-type':
            return <AddItemType />;
          case 'stock-search':
            return <StockSearch />;
          case 'barcode-printing':
            return <BarcodePrinting />;
          case 'changed-sale-price-report':
            return <ChangedPriceReport />;
          case 'short-item-list':
            return <ShortItemList />;
          case 'expiry-report':
            return <ExpiryReport />;
          default:
            return <MagicUiAnimation text='Stock Management' />;
        }
      case 'purchases':
        switch (pathParts[3]) {
          case 'purchase-item':
            return <PurchaseItem />;
          case 'add-supplier':
            return <AddSupplier />;
          case 'purchase-report':
            return <PurchaseReport />;
          case 'suppliers':
            return <MySuppliers />;
          case 'add-company':
            return <AddCompany />;
          case 'companies':
            return <MyCompanies />;

          case 'purchase-return':
            return <PurchaseReturn />;
          default:
            return <MagicUiAnimation text='Purchase Management' />;
        }
      case 'accounts':
        switch (pathParts[3]) {
          case 'posting':
            return <Posting />;
          case 'daily-reports':
            return <DailyReport />
          case 'opening-&-adjustment-balance':
            return <OpeningAndAdjustmentBalance />;
          case 'expense-entry':
            return <ExpenseEntry />;
          case 'new-account':
            return <NewAccount />;
          case 'vendor-journal-entry':
            return <VendorJournalEntry />;
          case 'customer-journal-entry':
            return <CustomerJournalEntry />;
          case 'ledger':
            return <Ledger />;
          case 'journal':
            return <Journal />;
          case 'income-statement':
            return <IncomeStatement />;
          case 'merge-accounts':
            return <MergeAccounts />;
          default:
            return <MagicUiAnimation text='Accounts Management' />;
        }
      case 'users':
        switch (pathParts[3]) {
          case 'add-new-users':
            return <AddUser />;
          case 'all-users':
            return <AllUsers />;
          case 'rights':
            return <Rights />;
          default:
            return <MagicUiAnimation text='Accounts Management' />;
        }
      default:
        return <div>Coming Soon</div>;
    }
  };

  return (
    <div className='flex'>
      <FeaturesCategory />
      <div className='w-full bg-gray-100 p-4 overflow-auto scrollbar scrollbar-thumb-primary scrollbar-track-transparent'>
        {renderActiveFeature()}
      </div>
    </div>
  );
}

export default Home;