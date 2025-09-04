/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import config from "../../../features/config";
import { setPurchaseData } from "../../../store/slices/purchase/purchaseItemSlice";
import Loader from "../../../pages/Loader";
import { useNavigate } from "react-router-dom";
import Button from "../../Button";
import ViewPurchase from "./ViewPurchase";

const ITEMS_PER_PAGE = 200;

function PurchaseReport() {
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalFlatDiscount, setTotalFlatDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [validationMessage, setValidationMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isBillOpen, setIsBillOpen] = useState(false);
  const [bill, setBill] = useState(null);

  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    vendorSupplierId: "",
    vendorCompanyId: "",
    status: [],
  });

  const { primaryPath } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const supplierData = useSelector((state) => state.suppliers.supplierData);
  const companyData = useSelector((state) => state.companies.companyData);
  const purchaseData = useSelector((state) => state.purchaseItem.purchaseData);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllPurchases();
  }, []);

  const fetchAllPurchases = async () => {
    try {
      setIsLoading(true);

      const start = new Date(filters.startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);

      const query = {
        ...filters,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        status: filters.status.join(","),
      };

      const response = await config.fetchAllPurchases(query);

      if (response) {
        dispatch(setPurchaseData(response.data));
        calculateTotals(response.data);
      }
    } catch (error) {
      console.error("Error fetching purchases:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotals = (data) => {
    const totalPurchaseCounter = data.reduce(
      (acc, item) => acc + Number(item.totalAmount),
      0
    );
    const totalQtyCounter = data.reduce(
      (acc, item) => acc + Number(item.totalQuantity),
      0
    );
    const totalDiscountCounter = data.reduce(
      (acc, item) => acc + Number(item.flatDiscount),
      0
    );

    setTotalPurchases(totalPurchaseCounter);
    setTotalQuantity(totalQtyCounter);
    setTotalFlatDiscount(totalDiscountCounter);
    setTotalAmount(totalPurchaseCounter - totalDiscountCounter);
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
    if (
      filters.startDate &&
      filters.endDate &&
      new Date(filters.endDate) < new Date(filters.startDate)
    ) {
      setValidationMessage("End date cannot be earlier than start date.");
      return;
    }
    fetchAllPurchases();
  };

  const getDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalPages = Math.ceil(purchaseData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, purchaseData.length);
  const paginatedPurchases = purchaseData.slice(startIndex, endIndex);

  return isBillOpen ? (
    <ViewPurchase
      bill={bill}
      isOpen={isBillOpen}
      onClose={() => setIsBillOpen(!isBillOpen)}
    />
  ) : isLoading ? (
    <Loader h_w="h-16 w-16 border-b-4 border-t-4" message="Loading Purchases...." />
  ) : (
    <div className="p-4 bg-white border rounded shadow-md text-xs">
      {/* Section 1: Filters */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-12 gap-2">
        <div className="border p-2 rounded col-span-2">
          <label className="block mb-1">Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleDateChange}
            className="border p-1 rounded w-full"
          />
        </div>

        <div className="border p-2 rounded col-span-2">
          <label className="block mb-1">End Date:</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleDateChange}
            className="border p-1 rounded w-full"
          />
        </div>

        <div className="border p-2 rounded col-span-2">
          <label className="block mb-1">Vendor Supplier:</label>
          <select
            className="border p-1 rounded w-full"
            name="vendorSupplierId"
            value={filters.vendorSupplierId}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                vendorSupplierId: e.target.value,
              }))
            }
          >
            <option value="">Select Supplier</option>
            {supplierData?.map((vendor, index) => (
              <option key={index} value={vendor._id}>
                {vendor.supplierName}
              </option>
            ))}
          </select>
        </div>

        <div className="border p-2 rounded col-span-2">
          <label className="block mb-1">Vendor Company:</label>
          <select
            className="border p-1 rounded w-full"
            name="vendorCompanyId"
            value={filters.vendorCompanyId}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                vendorCompanyId: e.target.value,
              }))
            }
          >
            <option value="">Select Company</option>
            {companyData?.map((vendor, index) => (
              <option key={index} value={vendor._id}>
                {vendor.companyName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-center col-span-2">
          <button
            className="bg-gray-600 hover:bg-gray-800 duration-200 text-white p-2 rounded"
            onClick={handleRetrieve}
          >
            Retrieve
          </button>
        </div>
      </div>

      <div className="w-full flex items-end justify-between pb-2">
        {<p className="text-red-600 mb-4">{validationMessage}</p>}
      </div>

      {/* Section 2: Items Table */}
      <div className="overflow-auto max-h-72 mb-4 scrollbar-thin rounded">
        <table className="min-w-full bg-white border text-xs">
          <thead className="sticky -top-1 border-b shadow-sm bg-gray-300 z-10">
            <tr>
              <th className="py-2 px-1 text-left">Purchase No.</th>
              <th className="py-2 px-1 text-left">Date & Time</th>
              <th className="py-2 px-1 text-left">Quantity of Items</th>
              <th className="py-2 px-1 text-left">Flat Discount</th>
              <th className="py-2 px-1 text-left">Total Amount</th>
              <th className="py-2 px-1 text-left">Vendor Name</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPurchases.length > 0 ? (
              paginatedPurchases.map((purchase, index) => (
                <tr
                  key={index}
                  className={`border-t hover:cursor-pointer ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-100"
                  }`}
                  onClick={() => {
                    setBill(purchase);
                    setIsBillOpen(true);
                  }}
                >
                  <td className="py-2 px-2">{purchase.purchaseBillNo}</td>
                  <td className="py-2 px-2">{getDate(purchase.purchaseDate)}</td>
                  <td className="py-2 px-2">{purchase.totalQuantity}</td>
                  <td className="py-2 px-2">{purchase.flatDiscount}</td>
                  <td className="py-2 px-2">{purchase.totalAmount}</td>
                  <td className="py-2 px-2">
                    {purchase.vendorSupplierId?.supplierName ||
                      purchase.vendorCompanyId?.companyName}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-2 px-4 text-center text-gray-500">
                  No purchases available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-sm mb-1">
          <Button
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-300"
            }`}
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-300"
            }`}
            onClick={() =>
              setCurrentPage(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Section 3: Totals */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div className="border p-2 rounded">
          <label className="block mb-1">Total No of Purchases:</label>
          <input
            type="text"
            className="border p-1 rounded w-full"
            value={purchaseData?.length || 0}
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
          <label className="block mb-1">Total Amount:</label>
          <input
            type="text"
            className="border p-1 rounded w-full"
            value={`${totalAmount}`}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}

export default PurchaseReport;
