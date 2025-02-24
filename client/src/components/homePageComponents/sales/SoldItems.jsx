/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import config from '../../../features/config';
import { setBillData, setBill } from '../../../store/slices/bills/billSlice';
import Loader from '../../../pages/Loader';
import { useNavigate } from 'react-router-dom';
import UpdateBill from './bills/UpdateBill';
import Button from '../../Button';

const ITEMS_PER_PAGE = 200; // Adjust as needed

function SoldItems() {
  const [totalSales, setTotalSales] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalFlatDiscount, setTotalFlatDiscount] = useState(0);
  const [totalGst, setTotalGst] = useState(0);
  const [validationMessage, setValidationMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [billId, setBillId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);


  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    billType: [],
    customer: "",
    billStatus: [],
  });

  const { primaryPath } = useSelector((state) => state.auth)  
  

  const dispatch = useDispatch();
  const customerData = useSelector((state) => state.customers.customerData)
  const billData = useSelector((state) => state.bills.billData);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllBills();
  }, []);
  // console.log("bill data before: ", billData);

  const fetchAllBills = async () => {
    try {
      const start = new Date(filters.startDate);
      start.setHours(0, 0, 0, 0); // Set to the start of the day
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999); // Set to the end of the day

      // const query = new URLSearchParams(filters).toString();
      const query = new URLSearchParams({
        ...filters,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        billType: filters.billType.join(","),
      billStatus: filters.billStatus.join(","),
      }).toString();

      const response = await config.fetchAllBills(query);
      if (response) {
        dispatch(setBillData(response.data));
        // console.log("bill data after: ", billData);
        calculateTotals(response.data);
      }
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotals = (data) => {
    const totalSaleCounter = data.reduce((acc, item) => acc + Number(item.totalAmount), 0);
    const totalQtyCounter = data.reduce((acc, item) => acc + Number(item.totalQuantity), 0);
    const totalDiscountCounter = data.reduce((acc, item) => acc + Number(item.flatDiscount), 0);
    const totalRemainingBalance = data.reduce((acc, item) => acc + Number(item.totalAmount - item.paidAmount), 0);

    setTotalSales(totalSaleCounter);
    setTotalQuantity(totalQtyCounter);
    setTotalFlatDiscount(totalDiscountCounter);
    setTotalGst(totalRemainingBalance);
  };

  const handleDateChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setValidationMessage("");
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: checked
        ? [...prev[name], value]
        : prev[name].filter((item) => item !== value),
    }));
  };

  const handleRetrieve = () => {
    if (filters.startDate && filters.endDate && new Date(filters.endDate) < new Date(filters.startDate)) {
      setValidationMessage("End date cannot be earlier than start date.");
      return;
    }
    fetchAllBills();
    console.log(filters)
  };

  const handleBillPayment = (billNo) => {
    navigate(`/${primaryPath}/sales/bill-payment/${billNo}`);
  };

  const viewBill = (billId) => {
    navigate(`/${primaryPath}/sales/view-bill/${billId}`);
  }

  const getDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',

    });
  }

  const totalPages = Math.ceil(billData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, billData.length);
  const paginatedBills = billData.slice(startIndex, endIndex);

  return isLoading ? (
    <Loader h_w="h-16 w-16 border-b-4 border-t-4" message="Loading Bills...." />
  ) : (
    isEditing ? 
    <UpdateBill billId={billId} setIsEditing={setIsEditing}/>
    :
    <div className="p-4 bg-white border rounded shadow-md text-xs">
      {/* Section 1: Filters */}

      <div className="mb-4 grid grid-cols-1 md:grid-cols-11 gap-2">
        <div className="border p-2 rounded col-span-2">
          <label className="block mb-1">Start Date:</label>
          <input
            type="date"
            className="border p-1 rounded w-full"
            name="startDate"
            value={filters.startDate || new Date()}
            onChange={handleDateChange}
          />
        </div>
        <div className="border p-2 rounded col-span-2">
          <label className="block mb-1">End Date:</label>
          <input
            type="date"
            className="border p-1 rounded w-full"
            name="endDate"
            value={filters.endDate}
            onChange={handleDateChange}
          />
        </div>
        <div className="border p-2 rounded col-span-2">
          <label className="block mb-1">Bill Type:</label>
          <div>
            {["A4", "thermal"].map((type) => (
              <label key={type} className="inline-flex items-center mr-2">
                <input
                  type="checkbox"
                  name="billType"
                  value={type}
                  checked={filters.billType.includes(type)}
                  onChange={handleCheckboxChange}
                  className="mr-1"
                />
                {type}
              </label>
            ))}
          </div>
        </div>
        <div className="border p-2 rounded col-span-2">
          <label className="block mb-1">Bill Status:</label>
          <div>
            {["paid", "unpaid"].map((status) => (
              <label key={status} className="inline-flex items-center mr-2">
                <input
                  type="checkbox"
                  name="billStatus"
                  value={status}
                  checked={filters.billStatus.includes(status)}
                  onChange={handleCheckboxChange}
                  className="mr-1"
                />
                {status}
              </label>
            ))}
          </div>
        </div>
        <div className="border p-2 rounded col-span-2">
          <label className="block mb-2">Customer:
            <select onChange={(e) => setFilters((prev) => ({
              ...prev,
              customer: e.target.value,
              }))} className={` border p-1 rounded text-xs w-36`}>
              <option value=''>Select Customer</option>
              {customerData && customerData?.map((customer, index) => (
                <option key={index}  value={customer._id}>{customer.customerName}</option>

              ))}
            </select>
          </label>
        </div>
        <div className='flex items-center justify-center'>
        <button
          className="bg-gray-600 hover:bg-gray-800 duration-200 text-white p-2 rounded"
          onClick={handleRetrieve}
        >
          Retrieve
        </button>
        </div>
      </div>

      <div className="w-full flex items-end justify-between">
        {<p className="text-red-600 mb-4">{validationMessage}</p>}
        
      </div>

      {/* Section 2: Items Table */}
      <div className="overflow-auto max-h-72 mb-4 scrollbar-thin rounded">
        <table className="min-w-full bg-white border text-xs">
          <thead className="sticky -top-1 border-b shadow-sm bg-gray-300 z-10">
            <tr>
              <th className="py-2 px-1 text-left">Bill No.</th>
              <th className="py-2 px-1 text-left">Date & Time</th>
              <th className="py-2 px-1 text-left">QTY of Items</th>
              <th className="py-2 px-1 text-left">Flat Discount</th>
              <th className="py-2 px-1 text-left">Total Amount</th>
              <th className="py-2 px-1 text-left">Bill Balance</th>
              <th className="py-2 px-1 text-left">Customer Name</th>
              <th className="py-2 px-1 text-left">Status</th>
              <th className="py-2 px-1 text-left">Actions</th>
              <th className="py-2 px-1 text-left"></th>
              <th className="py-2 px-1 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedBills.length > 0 ? (
              paginatedBills.map((bill, index) => (
                <tr key={index} className={`border-t hover:cursor-pointer  ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
                
                >
                  <td className="py-2 px-2">{bill.billNo}</td>
                  <td className="py-2 px-2">{getDate(bill.createdAt)}</td>
                  <td className="py-2 px-2">{bill.totalQuantity}</td>
                  <td className="py-2 px-2">{bill.flatDiscount}</td>
                  <td className="py-2 px-2">{bill.totalAmount}</td>
                  <td className="py-2 px-2">{bill.totalAmount - bill.paidAmount - bill.flatDiscount}</td>
                  <td className="py-2 px-2">{bill.customer?.customerName}</td>
                  <td className="py-2 px-2">
                    <span
                      className={`px-2 py-1 rounded-lg ${bill.isPosted ? 'bg-white text-black' : (bill.billStatus === "paid" ? 'bg-green-600' : 'bg-red-700 text-white')
                        }`}
                    >
                      {bill.isPosted ? "Bill Posted" : (bill.billStatus === "paid" ? 'Paid' : 'Unpaid')}
                    </span>
                  </td>
                  <td className="py-1 px-2">
                    {bill.isPosted ? <span className='p-2'>Bill Posted</span> : (!(bill.billStatus === "paid") ? (
                      <button
                        className="bg-gray-600 hover:bg-gray-800 duration-200 text-white p-2 rounded"
                        onClick={() => handleBillPayment(bill.billNo)}
                      >
                        Add Payment
                      </button>
                    ) : <span className='p-2'>Bill paid</span>)}
                  </td>
                  {/* button to edit bill */}
                  <td>
                    {bill.isPosted ? <span className=''> Posted</span> : <button
                      className="bg-gray-600 hover:bg-gray-800 duration-200 text-white p-2 rounded"
                      onClick={() => {
                        setBillId(bill.billNo)
                        setIsEditing(true)
                      }}
                    >
                      Edit
                    </button>}
                    <button
                      className="bg-white border hover:text-white border-black hover:bg-gray-800 duration-200 text-black p-2 rounded ml-2"
                      onClick={() => viewBill(bill.billNo)}
                    >
                      View Bill
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="py-2 px-4 text-center text-gray-500">
                  No bills available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 text-sm">
                    <Button
                        className={`px-4 py-2 rounded-md ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>

                    <span className="text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>

                    <Button
                        className={`px-4 py-2 rounded-md ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
                        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}

      {/* Section 3: Total Calculations */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        <div className="border p-2 rounded">
          <label className="block mb-1">Total No of Bills:</label>
          <input
            type="text"
            className="border p-1 rounded w-full"
            value={billData?.length || 0}
            readOnly
          />
        </div>
        <div className="border p-2 rounded">
          <label className="block mb-1">Total Quantity of Items:</label>
          <input
            type="text"
            className="border p-1 rounded w-full"
            value={`${totalQuantity}`}
            readOnly
          />
        </div>
        <div className="border p-2 rounded">
          <label className="block mb-1">Total Flat Discount:</label>
          <input
            type="text"
            className="border p-1 rounded w-full"
            value={`${totalFlatDiscount}`}
            readOnly
          />
        </div>
        <div className="border p-2 rounded">
          <label className="block mb-1">Total Remaining Balance:</label>
          <input
            type="text"
            className="border p-1 rounded w-full"
            value={`${totalGst}`}
            readOnly
          />
        </div>
        <div className="border p-2 rounded">
          <label className="block mb-1">Total Amount of Sale:</label>
          <input
            type="text"
            className="border p-1 rounded w-full"
            value={`${totalSales}`}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}

export default SoldItems;

