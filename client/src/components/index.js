import Select from "./Select";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import Container from "./container/Container";
import Logo from "./Logo";
import LogoutBtn from "./Header/LogoutBtn";
import Signup from "./Signup";
import Login from "./Login";
import Button from "./Button";
import AuthLayout from "./AuthLayout";
import Input from "./Input";
import FeaturesCategory from "./homePageComponents/FeaturesCategory";
import Dashboard from "./homePageComponents/dashboard/Dashboard";
import RegisterBusiness from "./RegisterBusiness"
import ForgotPassword from "./ForgotPassword"
import AddRole from "./AddRole";

//stock
import StockRegistration from "./homePageComponents/stock/StockRegistration";
import StockIncrease from "./homePageComponents/stock/StockIncrease";
import StockDecrease from "./homePageComponents/stock/StockDecrease";
import StockReport from "./homePageComponents/stock/StockReport";
import ChangedPriceReport from "./homePageComponents/stock/ChangedPriceReport";
import AddItemCategory from "./homePageComponents/stock/AddItemCategory";
import AddItemType from "./homePageComponents/stock/AddItemType";
import StockSearch from "./homePageComponents/stock/StockSearch";
import ShortItemList from "./homePageComponents/stock/ShortItemList";
import ExpiryReport from "./homePageComponents/stock/ExpiryReport";

//sales
import InvoiceComponent from "./homePageComponents/sales/InvoiceComponent";
import SaleReturnAgainstBill from "./homePageComponents/sales/SaleReturnAgainstBill";
import DirectSaleReturn from "./homePageComponents/sales/DirectSaleReturn";
import SoldItems from "./homePageComponents/sales/SoldItems";
import SaleReports from "./homePageComponents/sales/SaleReports";
import AddCustomer from "./homePageComponents/sales/AddCustomer";
import Mycustomers from "./homePageComponents/sales/Mycustomers";
import AccountsReceivables from "./homePageComponents/sales/AccountsReceivables";
import BillPayment from "./homePageComponents/sales/bills/BillPayment";
import MergeBills from "./homePageComponents/sales/MergeBills";

//purchase

import PurchaseItem from "./homePageComponents/purchases/PurchaseItem";
import AddSupplier from "./homePageComponents/purchases/AddSupplier";
import MySuppliers from "./homePageComponents/purchases/MySuppliers";
import AddCompany from "./homePageComponents/purchases/AddCompany";
import MyCompanies from "./homePageComponents/purchases/MyCompanies";
import PurchaseReport from "./homePageComponents/purchases/PurchaseReport";
import PurchaseReturn from "./homePageComponents/purchases/PurchaseReturn";

//accounts
import DailyReport from "./homePageComponents/accounts/DailyReport";
import Posting from "./homePageComponents/accounts/Posting";
import OpeningAndAdjustmentBalance from "./homePageComponents/accounts/OpeningAndAdjustmentBalance";
import ExpenseEntry from "./homePageComponents/accounts/ExpenseEntry";
import VendorJournalEntry from "./homePageComponents/accounts/VendorJournalEntry";
import CustomerJournalEntry from "./homePageComponents/accounts/CustomerJournalEntry";
import NewAccount from "./homePageComponents/accounts/NewAccount";
import Ledger from "./homePageComponents/accounts/Ledger";
import IncomeStatement from "./homePageComponents/accounts/IncomeStatement";
import MergeAccounts from "./homePageComponents/accounts/MergeAccounts";

//users
import AddUser from "./homePageComponents/users/AddUser";
import AllUsers from "./homePageComponents/users/AllUsers";
import Rights from "./homePageComponents/users/Rights";

export {
    Header,
    Footer,
    Container,
    Logo,
    LogoutBtn,
    Signup,
    Login,
    Button,
    AuthLayout, 
    Input,
    Select,
    FeaturesCategory,
    Dashboard,
    RegisterBusiness,
    ForgotPassword,
    AddRole,
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
    VendorJournalEntry,
    CustomerJournalEntry,
    NewAccount,
    Ledger,
    IncomeStatement,
    MergeAccounts,
    //users
    AddUser,
    AllUsers,
    Rights


}