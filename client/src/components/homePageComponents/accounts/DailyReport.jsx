/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useMemo } from 'react';
import {
    TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package,
    Users, Building2, FileText, ArrowUpRight, ArrowDownRight,
    Calendar, Download, BarChart3, PieChart, Eye, ChevronDown,
    RefreshCw, Filter, Search, Clock, CreditCard, Wallet, X,
    Layers, ArrowRightLeft, Receipt, UserPlus, Building, Truck,
    Activity, Target, Percent, CircleDollarSign, TrendingUpDown,
    Mail, Phone, MapPin, Hash, CreditCard as CardIcon, AlertCircle,
    CheckCircle2, XCircle, MinusCircle, ExternalLink, Zap
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RPieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar, ComposedChart } from 'recharts';
import config from '../../../features/config';
import { useEffect } from 'react';

// Mock comprehensive data?
const mockData = {
    summary: {
        totalSales: 125000,
        totalRevenue: 45000,
        totalPurchases: 80000,
        totalExpenses: 15000,
        totalSaleReturns: 5000,
        totalReceivables: 35000,
        netCashFlow: 25000,
        cashInTotal: 50000,
        cashOutTotal: 25000
    },
    comparison: {
        previousPeriod: {
            totalSales: 110000,
            totalRevenue: 38000,
            totalPurchases: 75000,
            netCashFlow: 20000
        }
    },
    salesDetails: {
        bills: [
            { billNo: '00123', customerDetails: { customerName: 'ABC Corp', mobileNo: '+92 300 1234567' }, totalAmount: 5000, billRevenue: 1500, billStatus: 'paid', createdAt: '2025-01-15T10:30:00', salesPersonDetails: { firstname: 'John', lastname: 'Doe' }, billItems: [{ productDetails: { productName: 'Product A' }, quantity: 10, billItemPrice: 500 }] },
            { billNo: '00124', customerDetails: { customerName: 'XYZ Ltd', mobileNo: '+92 321 7654321' }, totalAmount: 8000, billRevenue: 2400, billStatus: 'partiallypaid', createdAt: '2025-01-15T11:45:00', salesPersonDetails: { firstname: 'Jane', lastname: 'Smith' }, billItems: [{ productDetails: { productName: 'Product B' }, quantity: 5, billItemPrice: 1600 }] },
            { billNo: '00125', customerDetails: { customerName: 'Tech Solutions', mobileNo: '+92 333 9876543' }, totalAmount: 12000, billRevenue: 3600, billStatus: 'unpaid', createdAt: '2025-01-15T14:20:00', salesPersonDetails: { firstname: 'Mike', lastname: 'Johnson' }, billItems: [{ productDetails: { productName: 'Product C' }, quantity: 8, billItemPrice: 1500 }] }
        ],
        byPriceCategory: [
            { _id: 'salePrice1', totalSales: 50000, itemCount: 120 },
            { _id: 'salePrice2', totalSales: 35000, itemCount: 80 },
            { _id: 'salePrice3', totalSales: 25000, itemCount: 60 },
            { _id: 'salePrice4', totalSales: 15000, itemCount: 40 }
        ]
    },
    purchaseDetails: [
        { purchaseBillNo: 'PUR-001', supplierDetails: { supplierName: 'Supplier A', mobileNo: '+92 300 1111111' }, totalAmount: 25000, purchaseItems: [{ productDetails: { productName: 'Raw Material A' }, quantity: 100, pricePerUnit: 250 }], createdAt: '2025-01-15T09:00:00' },
        { purchaseBillNo: 'PUR-002', companyDetails: { companyName: 'Company B', mobileNo: '+92 321 2222222' }, totalAmount: 35000, purchaseItems: [{ productDetails: { productName: 'Raw Material B' }, quantity: 70, pricePerUnit: 500 }], createdAt: '2025-01-15T13:30:00' }
    ],
    mergedBills: [
        { billNo: '00120', parentBill: { billNo: '00130' }, totalAmount: 3000, description: 'Bill merged into 00130', createdAt: '2025-01-15T16:00:00', customerDetails: { customerName: 'Merged Customer' } },
        { billNo: '00121', parentBill: { billNo: '00130' }, totalAmount: 2500, description: 'Bill merged into 00130', createdAt: '2025-01-15T16:05:00', customerDetails: { customerName: 'Another Customer' } }
    ],
    addedCustomers: [
        { customerName: 'New Customer A', mobileNo: '+92 300 9999999', email: 'customera@example.com', customerRegion: 'Islamabad', customerFlag: 'green', createdAt: '2025-01-15T10:00:00', cnic: '12345-1234567-1' },
        { customerName: 'New Customer B', mobileNo: '+92 321 8888888', email: 'customerb@example.com', customerRegion: 'Lahore', customerFlag: 'yellow', createdAt: '2025-01-15T15:30:00', cnic: '54321-7654321-2' }
    ],
    addedSuppliers: [
        { supplierName: 'New Supplier X', mobileNo: '+92 333 7777777', email: 'supplierx@example.com', supplierRegion: 'Karachi', createdAt: '2025-01-15T11:00:00', cnic: '11111-1111111-1' }
    ],
    addedCompanies: [
        { companyName: 'New Company Y', mobileNo: '+92 300 6666666', email: 'companyy@example.com', companyRegion: 'Rawalpindi', createdAt: '2025-01-15T12:00:00' }
    ],
    saleReturnDetails: [
        { returnType: 'againstBill', billDetails: { billNo: '00115' }, customerDetails: { customerName: 'Return Customer' }, totalReturnAmount: 2000, returnItems: [{ productDetails: { productName: 'Returned Product' }, quantity: 4, returnPrice: 500 }], returnReason: 'Defective items', returnDate: '2025-01-15T14:00:00' }
    ],
    accountReceivables: [
        { customer: { customerName: 'Outstanding Client A', customerRegion: 'Islamabad', mobileNo: '+92 300 5555555' }, accountBalance: 15000, individualAccountName: 'Client A Account' },
        { customer: { customerName: 'Outstanding Client B', customerRegion: 'Lahore', mobileNo: '+92 321 4444444' }, accountBalance: 20000, individualAccountName: 'Client B Account' }
    ],
    expenseDetails: [
        { debit: 5000, description: 'Office Supplies', expenseAccount: { individualAccountName: 'Supplies Expense' }, createdAt: '2025-01-15T10:00:00' },
        { debit: 10000, description: 'Utility Bills', expenseAccount: { individualAccountName: 'Utilities Expense' }, createdAt: '2025-01-15T15:00:00' }
    ],
    openingBalances: [
        { individualAccountId: { individualAccountName: 'Cash Account', accountBalance: 50000 }, debit: 50000, createdAt: '2025-01-15T00:00:00' }
    ],
    closingBalances: [
        { individualAccountId: { individualAccountName: 'Cash Account', accountBalance: 75000 }, credit: 75000, createdAt: '2025-01-15T23:59:59' }
    ],
    mergedAccounts: [
        { individualAccountName: 'Old Account A', mergedInto: { individualAccountName: 'Main Account' }, accountBalance: 5000, createdAt: '2025-01-15T12:00:00' }
    ],
    cashFlowDetails: [
        { details: 'Cash Received', cashIn: 15000, cashOut: 0, accountDetails: { individualAccountName: 'Customer Payment' }, createdAt: '2025-01-15T09:30:00' },
        { details: 'Cash Given', cashIn: 0, cashOut: 10000, accountDetails: { individualAccountName: 'Vendor Payment' }, createdAt: '2025-01-15T14:00:00' }
    ],
    vendorJournalEntries: [
        { debit: 8000, details: 'Payment to Supplier', supplier: { supplierName: 'Vendor ABC' }, createdAt: '2025-01-15T11:00:00' }
    ],
    customerJournalEntries: [
        { credit: 12000, details: 'Payment from Customer', customer: { customerName: 'Client XYZ' }, createdAt: '2025-01-15T16:00:00' }
    ]
};

// Chart data?
const salesTrendData = [
    { time: '9 AM', sales: 5000, revenue: 1500 },
    { time: '11 AM', sales: 8000, revenue: 2400 },
    { time: '2 PM', sales: 12000, revenue: 3600 },
    { time: '4 PM', sales: 15000, revenue: 4500 }
];

const DailyReportsUI = () => {
    const [dateRange, setDateRange] = useState({
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
    const [comparisonMode, setComparisonMode] = useState(false);
    const [activeView, setActiveView] = useState('overview');
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState(null);

    //   const data? = mockData;

    const getReports = async () => {
        try {
            const res = await config.getDailyReports(dateRange);
            console.log('res', res)
            if (res.data) setData(res.data)
        } catch (error) {
            console.log('error', error)
        }
    }

    const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'];

    const calculateChange = (current, previous) => {
        if (!previous) return 0;
        return (((current - previous) / previous) * 100).toFixed(1);
    };

    useEffect(() => {
        getReports()
    }, [dateRange])

    const AnimatedCard = ({ children, delay = 0 }) => (
        <div
            className="transform transition-all duration-500 hover:scale-[1.02]"
            style={{
                animation: `slideUp 0.6s ease-out ${delay}s both`,
            }}
        >
            {children}
        </div>
    );

    const MetricCard = ({ icon: Icon, title, value, change, subtitle, color, delay = 0 }) => {
        const isPositive = value >= 0;
        return (
            <AnimatedCard delay={delay}>
                <div className={`relative overflow-hidden bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group`}>
                    <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`} />

                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
                                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
                            </div>
                            {change !== undefined && (
                                <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                    {/* <span className="text-sm font-bold">{Math.abs(change)}%</span> */}
                                </div>
                            )}
                        </div>

                        <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
                        <p className={`text-2xl font-bold mb-1 ${(change !== undefined) && isPositive ? 'text-green-700' : (isPositive) ? '' : 'text-red-700'}`}>
                            {typeof value === 'number' ? `PKR ${value?.toLocaleString()}` : value}
                        </p>
                        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
                    </div>

                    <div className={`absolute bottom-0 left-0 h-1 ${color} transform origin-left transition-transform duration-700 group-hover:scale-x-100 scale-x-0`} style={{ width: '100%' }} />
                </div>
            </AnimatedCard>
        );
    };

    const DetailModal = ({ title, data, onClose, type }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slideUp">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                    <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                    {type === 'bills' && data?.map((bill, idx) => (
                        <div key={idx} className="mb-6 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Bill #{bill.billNo}</h3>
                                    <p className="text-gray-600">{bill.customerDetails?.customerName || 'Walk-in'}</p>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-sm font-bold ${bill.billStatus === 'paid' ? 'bg-green-100 text-green-800' :
                                    bill.billStatus === 'partiallypaid' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                    {bill.billStatus}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                                    <p className="font-bold text-lg">PKR {bill.totalAmount?.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Revenue</p>
                                    <p className="font-bold text-lg text-green-600">PKR {bill?.billRevenue?.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Sales Person</p>
                                    <p className="font-semibold">{bill.salesPersonDetails?.firstname} {bill.salesPersonDetails?.lastname}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Time</p>
                                    <p className="font-semibold">{new Date(bill.createdAt).toLocaleTimeString()}</p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-semibold mb-2">Items:</h4>
                                {bill.billItems?.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                        <span>{item.productDetails?.productName}</span>
                                        <div className="text-right">
                                            <span className="text-gray-600">Qty: {item.quantity}</span>
                                            <span className="ml-4 font-semibold">PKR {(item.quantity * item.billItemPrice)?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {type === 'customers' && data?.map((customer, idx) => (
                        <div key={idx} className="mb-4 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                        {customer.customerName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{customer.customerName}</h3>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${customer.customerFlag === 'green' ? 'bg-green-100 text-green-800' :
                                            customer.customerFlag === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                                customer.customerFlag === 'red' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {customer.customerFlag} Flag
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right text-sm text-gray-500">
                                    <Clock className="w-4 h-4 inline mr-1" />
                                    {new Date(customer.createdAt)?.toLocaleString()}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <Phone className="w-4 h-4 text-green-600" />
                                    <span>{customer.mobileNo}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <Mail className="w-4 h-4 text-green-600" />
                                    <span>{customer.email}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <MapPin className="w-4 h-4 text-green-600" />
                                    <span>{customer.customerRegion}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <Hash className="w-4 h-4 text-green-600" />
                                    <span>{customer.cnic}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {type === 'suppliers' && data?.map((supplier, idx) => (
                        <div key={idx} className="mb-4 p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-violet-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                        {supplier.supplierName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{supplier.supplierName}</h3>
                                        <p className="text-gray-600 text-sm">Supplier</p>
                                    </div>
                                </div>
                                <div className="text-right text-sm text-gray-500">
                                    <Clock className="w-4 h-4 inline mr-1" />
                                    {new Date(supplier.createdAt)?.toLocaleString()}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <Phone className="w-4 h-4 text-purple-600" />
                                    <span>{supplier.mobileNo}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <Mail className="w-4 h-4 text-purple-600" />
                                    <span>{supplier.email}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <MapPin className="w-4 h-4 text-purple-600" />
                                    <span>{supplier.supplierRegion}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <Hash className="w-4 h-4 text-purple-600" />
                                    <span>{supplier.cnic}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {type === 'mergedBills' && data?.map((bill, idx) => (
                        <div key={idx} className="mb-4 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-amber-100 rounded-lg">
                                        <Layers className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Bill #{bill.billNo}</h3>
                                        <p className="text-sm text-gray-600">Merged into #{bill.parentBill?.billNo}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-gray-900">PKR {bill.totalAmount?.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500">{new Date(bill.createdAt)?.toLocaleString()}</p>
                                </div>
                            </div>
                            <p className="text-gray-700">{bill.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const customerFlag = (cat) => {
        return cat?._id === 'salePrice4' ?
            'White' :
            (cat?._id === 'salePrice3') ?
                'Yellow' :
                (cat?._id === 'salePrice2') ?
                    'Green' : 'Red'
    }

    return (
        <div className="max-h-[85svh] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 ">
            <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.5s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>

            {selectedDetail && (
                <DetailModal
                    title={selectedDetail.title}
                    data={selectedDetail.data}
                    type={selectedDetail.type}
                    onClose={() => setSelectedDetail(null)}
                />
            )}

            {/* Header Section */}
            <div className="mb-8 animate-slideUp">
                <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex items-center space-x-4">
                            <div className="p-4 bg-gradient-to-br from-primary to-primary rounded-2xl shadow-lg">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
                                    Daily Reports Dashboard
                                </h1>
                                <p className="text-gray-600 flex items-center mt-1">
                                    <Clock className="w-4 h-4 mr-2" />
                                    Last updated: {new Date().toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button className="flex items-center px-6 py-3 bg-gradient-to-r from-primary to-primary text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                onClick={() => getReports()}
                            >
                                <RefreshCw className="w-5 h-5 mr-2" />
                                Refresh
                            </button>

                            {/* <button className="flex items-center px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all shadow-lg">
                <Download className="w-5 h-5 mr-2" />
                Export
              </button> */}

                            {/* <button 
                onClick={() => setComparisonMode(!comparisonMode)}
                className={`flex items-center px-6 py-3 rounded-xl transition-all shadow-lg ${
                  comparisonMode 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' 
                    : 'bg-white border-2 border-green-600 text-green-600 hover:bg-green-50'
                }`}
              >
                <TrendingUpDown className="w-5 h-5 mr-2" />
                Compare
              </button> */}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <Calendar className="w-5 h-5 text-primary" />
                            <div className="flex-1">
                                <label className="text-xs text-gray-600 block mb-1">Select Date</label>
                                <input
                                    type="date"
                                    value={dateRange.startDate}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value, endDate: e.target.value }))}
                                    className="w-full bg-transparent border-none focus:outline-none font-semibold text-gray-900"
                                />
                            </div>
                        </div>

                        {/* <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <label className="text-xs text-gray-600 block mb-1">To Date</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full bg-transparent border-none focus:outline-none font-semibold text-gray-900"
                />
              </div>
            </div> */}

                        {/* <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search in reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div> */}
                    </div>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                    icon={DollarSign}
                    title="Total Sales"
                    value={data?.summary.totalSales}
                    //   change={comparisonMode ? calculateChange(data?.summary.totalSales, data?.comparison.previousPeriod.totalSales) : undefined}
                    subtitle={comparisonMode ? `Previous: PKR ${data?.comparison.previousPeriod.totalSales?.toLocaleString()}` : undefined}
                    color="bg-emerald-500"
                    delay={0}
                />
                <MetricCard
                    icon={TrendingUp}
                    title="Total Revenue"
                    value={data?.summary.totalRevenue}
                    //   change={comparisonMode ? calculateChange(data?.summary.totalRevenue, data?.comparison.previousPeriod.totalRevenue) : undefined}
                    subtitle={comparisonMode ? `Previous: PKR ${data?.comparison.previousPeriod.totalRevenue?.toLocaleString()}` : undefined}
                    color="bg-blue-500"
                    delay={0.1}
                />
                <MetricCard
                    icon={ShoppingCart}
                    title="Total Purchases"
                    value={data?.summary.totalPurchases}
                    //   change={comparisonMode ? calculateChange(data?.summary.totalPurchases, data?.comparison.previousPeriod.totalPurchases) : undefined}
                    subtitle={comparisonMode ? `Previous: PKR ${data?.comparison.previousPeriod.totalPurchases?.toLocaleString()}` : undefined}
                    color="bg-purple-500"
                    delay={0.2}
                />
                <MetricCard
                    icon={Wallet}
                    title="Net Cash Flow"
                    value={data?.summary.netCashFlow}
                    change={data?.summary.netCashFlow}
                    subtitle={comparisonMode ? `Previous: PKR ${data?.comparison.previousPeriod.netCashFlow?.toLocaleString()}` : undefined}
                    color="bg-amber-500"
                    delay={0.3}
                />
            </div>

            {/* Sales Trend Chart */}
            <AnimatedCard delay={0.4}>
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Activity className="w-6 h-6 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Sales & Revenue Trend</h2>
                        </div>
                    </div>

                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={salesTrendData}>
                            <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="time" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: 'white' }}
                            />
                            <Legend />
                            <Area type="monotone" dataKey="sales" stroke="#3B82F6" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
                            <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </AnimatedCard>

            {/* Sales by Price Category */}
            <AnimatedCard delay={0.5}>
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <PieChart className="w-6 h-6 text-purple-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Sales by Price Category</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <ResponsiveContainer width="100%" height={300} className={'bg-primary/50 rounded-lg'}>
                            <RPieChart>
                                <Pie
                                    data={data?.salesDetails?.byPriceCategory}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="totalSales"
                                >
                                    {data?.salesDetails?.byPriceCategory.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={customerFlag(entry)} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '12px', color: 'primary' }}
                                />
                            </RPieChart>
                        </ResponsiveContainer>

                        <div className="space-y-4 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent">
                            {data?.salesDetails?.byPriceCategory.map((cat, idx) => {

                                return (
                                    <div key={idx} className="relative overflow-hidden bg-gradient-to-r from-gray-50 to-primary/50 p-5 rounded-xl border border-gray-200 hover:shadow-lg transition-all group">
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: customerFlag(cat) }} />
                                                <h4 className="text-sm font-bold text-gray-900">{customerFlag(cat)} Customers</h4>
                                            </div>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                                                {cat.itemCount} items
                                            </span>
                                        </div>

                                        <p className="text-xl font-bold text-gray-900 mb-1">PKR {cat.totalSales?.toLocaleString()}</p>

                                        <div className="relative h-2 bg-gray-300 rounded-full overflow-hidden">
                                            <div
                                                className="absolute h-full rounded-full transition-all duration-1000 ease-out"
                                                style={{
                                                    width: `${(cat.totalSales / data?.summary.totalSales) * 100}%`,
                                                    backgroundColor: customerFlag(cat)
                                                }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-600 mt-2">
                                            {((cat.totalSales / data?.summary.totalSales) * 100).toFixed(1)}% of total sales
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </AnimatedCard>

            {/* Interactive Details Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <AnimatedCard delay={0.6}>
                    <div
                        onClick={() => setSelectedDetail({ title: 'Sales Details', data: data?.salesDetails?.bills, type: 'bills' })}
                        className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 shadow-xl cursor-pointer transform hover:scale-105 transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <FileText className="w-10 h-10 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                            <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h3 className="text-white text-lg font-semibold mb-2">Sales Details</h3>
                        <p className="text-white text-4xl font-bold mb-2">{data?.salesDetails?.bills.length}</p>
                        <p className="text-blue-100 text-sm">Bills generated today</p>
                        <div className="mt-4 pt-4 border-t border-blue-400">
                            <p className="text-white text-sm">Click to view full details →</p>
                        </div>
                    </div>
                </AnimatedCard>

                <AnimatedCard delay={0.7}>
                    <div
                        onClick={() => setSelectedDetail({ title: 'New Customers', data: data?.addedCustomers, type: 'customers' })}
                        className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-xl cursor-pointer transform hover:scale-105 transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <UserPlus className="w-10 h-10 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                            <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h3 className="text-white text-lg font-semibold mb-2">New Customers</h3>
                        <p className="text-white text-4xl font-bold mb-2">{data?.addedCustomers.length}</p>
                        <p className="text-green-100 text-sm">Customers added today</p>
                        <div className="mt-4 pt-4 border-t border-green-400">
                            <p className="text-white text-sm">Click to view full details →</p>
                        </div>
                    </div>
                </AnimatedCard>

                <AnimatedCard delay={0.8}>
                    <div
                        onClick={() => setSelectedDetail({ title: 'New Suppliers', data: data?.addedSuppliers, type: 'suppliers' })}
                        className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-6 shadow-xl cursor-pointer transform hover:scale-105 transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <Truck className="w-10 h-10 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                            <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h3 className="text-white text-lg font-semibold mb-2">New Suppliers</h3>
                        <p className="text-white text-4xl font-bold mb-2">{data?.addedSuppliers.length}</p>
                        <p className="text-purple-100 text-sm">Suppliers added today</p>
                        <div className="mt-4 pt-4 border-t border-purple-400">
                            <p className="text-white text-sm">Click to view full details →</p>
                        </div>
                    </div>
                </AnimatedCard>

                <AnimatedCard delay={0.9}>
                    <div
                        onClick={() => setSelectedDetail({ title: 'Merged Bills', data: data?.mergedBills, type: 'mergedBills' })}
                        className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 shadow-xl cursor-pointer transform hover:scale-105 transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <Layers className="w-10 h-10 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                            <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h3 className="text-white text-lg font-semibold mb-2">Merged Bills</h3>
                        <p className="text-white text-4xl font-bold mb-2">{data?.mergedBills.length}</p>
                        <p className="text-amber-100 text-sm">Bills merged today</p>
                        <div className="mt-4 pt-4 border-t border-amber-400">
                            <p className="text-white text-sm">Click to view full details →</p>
                        </div>
                    </div>
                </AnimatedCard>

                <AnimatedCard delay={1.0}>
                    <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <Package className="w-10 h-10 text-white opacity-80" />
                        </div>
                        <h3 className="text-white text-lg font-semibold mb-2">Account Receivables</h3>
                        <p className="text-white text-4xl font-bold mb-2">PKR {data?.summary.totalReceivables?.toLocaleString()}</p>
                        <p className="text-red-100 text-sm">{data?.accountReceivables.length} outstanding accounts</p>
                    </div>
                </AnimatedCard>

                <AnimatedCard delay={1.1}>
                    <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <CircleDollarSign className="w-10 h-10 text-white opacity-80" />
                        </div>
                        <h3 className="text-white text-lg font-semibold mb-2">Total Expenses</h3>
                        <p className="text-white text-4xl font-bold mb-2">PKR {data?.summary.totalExpenses?.toLocaleString()}</p>
                        <p className="text-cyan-100 text-sm">{data?.expenseDetails.length} expense entries</p>
                    </div>
                </AnimatedCard>
            </div>

            {/* Cash Flow Visualization */}
            <AnimatedCard delay={1.2}>
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Wallet className="w-6 h-6 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Cash Flow Analysis</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl border-2 border-green-200 group hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-green-700 font-semibold">Cash Inflow</span>
                                <ArrowUpRight className="w-6 h-6 text-green-600 group-hover:scale-125 transition-transform" />
                            </div>
                            <p className="text-4xl font-bold text-green-800 mb-1">PKR {data?.summary.cashInTotal?.toLocaleString()}</p>
                            <p className="text-sm text-green-600">↑ Money received</p>
                        </div>

                        <div className="relative overflow-hidden bg-gradient-to-br from-red-50 to-rose-100 p-6 rounded-xl border-2 border-red-200 group hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-red-700 font-semibold">Cash Outflow</span>
                                <ArrowDownRight className="w-6 h-6 text-red-600 group-hover:scale-125 transition-transform" />
                            </div>
                            <p className="text-4xl font-bold text-red-800 mb-1">PKR {data?.summary.cashOutTotal?.toLocaleString()}</p>
                            <p className="text-sm text-red-600">↓ Money paid</p>
                        </div>

                        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl border-2 border-blue-200 group hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-blue-700 font-semibold">Net Cash Flow</span>
                                <Zap className="w-6 h-6 text-blue-600 group-hover:rotate-12 transition-transform" />
                            </div>
                            <p className="text-4xl font-bold text-blue-800 mb-1">PKR {data?.summary.netCashFlow?.toLocaleString()}</p>
                            <p className="text-sm text-blue-600">Total balance</p>
                        </div>
                    </div>

                    <ResponsiveContainer width="100%" height={250}>
                        <ComposedChart data={[
                            { name: 'Cash In', value: data?.summary.cashInTotal, fill: '#10B981' },
                            { name: 'Cash Out', value: data?.summary.cashOutTotal, fill: '#EF4444' },
                            { name: 'Net Flow', value: data?.summary.netCashFlow, fill: '#3B82F6' }
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="name" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: 'white' }}
                            />
                            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                {[
                                    { name: 'Cash In', value: data?.summary.cashInTotal, fill: '#10B981' },
                                    { name: 'Cash Out', value: data?.summary.cashOutTotal, fill: '#EF4444' },
                                    { name: 'Net Flow', value: data?.summary.netCashFlow, fill: '#3B82F6' }
                                ].map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </AnimatedCard>

            {/* Footer Stats */}
            <AnimatedCard delay={1.3}>
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-2xl">
                    <h3 className="text-2xl font-bold mb-6">Quick Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Sale Returns</p>
                            <p className="text-3xl font-bold">{data?.saleReturnDetails.length}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Purchases</p>
                            <p className="text-3xl font-bold">{data?.purchaseDetails.length}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Merged Accounts</p>
                            <p className="text-3xl font-bold">{data?.mergedAccounts.length}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm mb-1">New Companies</p>
                            <p className="text-3xl font-bold">{data?.addedCompanies.length}</p>
                        </div>
                    </div>
                </div>
            </AnimatedCard>
        </div>
    );
};

export default DailyReportsUI;