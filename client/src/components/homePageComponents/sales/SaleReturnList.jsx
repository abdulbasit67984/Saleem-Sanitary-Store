/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import config from "../../../features/config";
import functions from "../../../features/functions";
import Loader from "../../../pages/Loader";
import Input from "../../Input";
import Button from "../../Button";
import {
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Printer,
  Search,
  Filter,
  Package,
  Calendar,
  User,
  FileText,
  X,
  ArrowDownCircle,
} from "lucide-react";
import { showErrorToast } from "../../../utils/toast";

const SaleReturnList = () => {
  const [saleReturns, setSaleReturns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedReturn, setExpandedReturn] = useState(null);
  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    returnType: "",
    customer: "",
  });

  const customerData = useSelector((state) => state.customers.customerData);
  const userData = useSelector((state) => state.auth.userData);
  const printRef = useRef();

  const fetchSaleReturns = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.returnType) params.append("returnType", filters.returnType);
      if (filters.customer) params.append("customer", filters.customer);

      const response = await config.getSaleReturns(params.toString());
      if (response?.data) {
        setSaleReturns(response.data);
      }
    } catch (error) {
      console.error("Error fetching sale returns:", error);
      showErrorToast("Failed to load sale returns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaleReturns();
  }, []);

  const handleSearch = () => {
    fetchSaleReturns();
  };

  const handleReset = () => {
    setFilters({
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      returnType: "",
      customer: "",
    });
  };

  const toggleExpand = (id) => {
    setExpandedReturn(expandedReturn === id ? null : id);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const totalReturnAmount = saleReturns.reduce(
    (sum, r) => sum + (r.totalReturnAmount || 0),
    0
  );
  const totalItems = saleReturns.reduce(
    (sum, r) =>
      sum + r.returnItems.reduce((s, item) => s + (item.quantity || 0), 0),
    0
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("en-PK", {
      timeZone: "Asia/Karachi",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getReturnTypeBadge = (type) => {
    if (type === "direct") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-orange-100 text-orange-700 border border-orange-200">
          Direct Return
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700 border border-blue-200">
        Against Bill
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending:
        "bg-yellow-50 text-yellow-700 border-yellow-200",
      approved:
        "bg-green-50 text-green-700 border-green-200",
      rejected:
        "bg-red-50 text-red-700 border-red-200",
    };
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
          styles[status] || styles.pending
        }`}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-50 rounded-lg">
            <RotateCcw className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">Sale Returns</h1>
            <p className="text-xs text-gray-500">
              View and manage all sale return records
            </p>
          </div>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition text-gray-700"
        >
          <Printer className="w-3.5 h-3.5" />
          Print Report
        </button>
      </div>

      {/* Filters */}
      <div className="px-5 py-3 bg-white border-b">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
              From
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
              To
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
              Return Type
            </label>
            <select
              value={filters.returnType}
              onChange={(e) =>
                setFilters({ ...filters, returnType: e.target.value })
              }
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none min-w-[120px]"
            >
              <option value="">All Types</option>
              <option value="direct">Direct Return</option>
              <option value="againstBill">Against Bill</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
              Customer
            </label>
            <select
              value={filters.customer}
              onChange={(e) =>
                setFilters({ ...filters, customer: e.target.value })
              }
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none min-w-[150px]"
            >
              <option value="">All Customers</option>
              {customerData?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.customerName}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSearch}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg transition shadow-sm"
          >
            <Search className="w-3.5 h-3.5" />
            Search
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-5 py-3 grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border p-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-50">
            <RotateCcw className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">
              Total Returns
            </p>
            <p className="text-lg font-bold text-gray-800">
              {saleReturns.length}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-50">
            <Package className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">
              Items Returned
            </p>
            <p className="text-lg font-bold text-gray-800">{totalItems}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-50">
            <ArrowDownCircle className="w-4 h-4 text-green-500" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">
              Total Amount
            </p>
            <p className="text-lg font-bold text-gray-800">
              Rs. {functions.formatAsianNumber(totalReturnAmount)}
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-10">
          <Loader
            h_w="h-10 w-10 border-t-3 border-b-3"
            message="Loading sale returns..."
          />
        </div>
      )}

      {/* Sale Returns List */}
      {!loading && (
        <div className="px-5 pb-5">
          <div ref={printRef} className="bg-white rounded-xl border shadow-sm overflow-hidden">
            {/* Print Header (hidden on screen) */}
            <div className="hidden print:block p-4 border-b text-center">
              <h2 className="text-sm font-bold">
                {userData?.BusinessId?.businessName}
              </h2>
              <p className="text-xs text-gray-600">Sale Returns Report</p>
              <p className="text-[10px] text-gray-500">
                {filters.startDate} to {filters.endDate}
              </p>
            </div>

            {/* Table */}
            <div className="overflow-auto max-h-[55vh] scrollbar-thin">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Bill No
                    </th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-center px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-center px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider print:hidden">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {saleReturns.length === 0 ? (
                    <tr>
                      <td
                        colSpan="9"
                        className="text-center py-12 text-gray-400"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <RotateCcw className="w-8 h-8 text-gray-300" />
                          <p className="text-sm font-medium">
                            No sale returns found
                          </p>
                          <p className="text-[10px]">
                            Try adjusting your filters or date range
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    saleReturns.map((saleReturn, index) => (
                      <React.Fragment key={saleReturn._id}>
                        {/* Main Row */}
                        <tr
                          className={`hover:bg-gray-50 cursor-pointer transition ${
                            expandedReturn === saleReturn._id
                              ? "bg-red-50/50"
                              : ""
                          }`}
                          onClick={() => toggleExpand(saleReturn._id)}
                        >
                          <td className="px-4 py-2.5 text-gray-500 font-medium">
                            {index + 1}
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-700">
                                {formatDate(saleReturn.returnDate)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-1.5">
                              <User className="w-3 h-3 text-gray-400" />
                              <span className="font-medium text-gray-700">
                                {saleReturn.customer?.customerName || (
                                  <span className="text-gray-400 italic">
                                    Walk-in
                                  </span>
                                )}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5">
                            {getReturnTypeBadge(saleReturn.returnType)}
                          </td>
                          <td className="px-4 py-2.5">
                            {saleReturn.billId ? (
                              <span className="inline-flex items-center gap-1 text-blue-600 font-medium">
                                <FileText className="w-3 h-3" />
                                {saleReturn.billId.billNo}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-700 font-semibold text-[10px]">
                              {saleReturn.returnItems?.length || 0}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-right font-semibold text-gray-800">
                            {functions.formatAsianNumber(
                              saleReturn.totalReturnAmount
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            {getStatusBadge(saleReturn.status)}
                          </td>
                          <td className="px-4 py-2.5 text-center print:hidden">
                            <button className="p-1 hover:bg-gray-100 rounded-md transition">
                              {expandedReturn === saleReturn._id ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                          </td>
                        </tr>

                        {/* Expanded Items Detail */}
                        {expandedReturn === saleReturn._id && (
                          <tr>
                            <td colSpan="9" className="px-0 py-0">
                              <div className="bg-gradient-to-b from-red-50/50 to-white px-6 py-4 border-t border-red-100">
                                {/* Return Items Table */}
                                <div className="mb-3">
                                  <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                    Returned Items
                                  </h4>
                                  <div className="bg-white rounded-lg border overflow-hidden">
                                    <table className="w-full text-xs">
                                      <thead>
                                        <tr className="bg-gray-50">
                                          <th className="text-left px-3 py-2 text-[10px] font-medium text-gray-500">
                                            Product
                                          </th>
                                          <th className="text-center px-3 py-2 text-[10px] font-medium text-gray-500">
                                            Qty
                                          </th>
                                          <th className="text-center px-3 py-2 text-[10px] font-medium text-gray-500">
                                            Units
                                          </th>
                                          <th className="text-right px-3 py-2 text-[10px] font-medium text-gray-500">
                                            Return Price
                                          </th>
                                          <th className="text-right px-3 py-2 text-[10px] font-medium text-gray-500">
                                            Total
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-100">
                                        {saleReturn.returnItems?.map(
                                          (item, idx) => {
                                            const pack = item.productId?.productPack || 1;
                                            const totalQty = (item.quantity || 0) + (item.returnUnits || 0) / pack;
                                            const itemTotal = totalQty * (item.returnPrice || 0);
                                            return (
                                              <tr
                                                key={idx}
                                                className="hover:bg-gray-50"
                                              >
                                                <td className="px-3 py-2">
                                                  <div className="flex items-center gap-2">
                                                    <Package className="w-3 h-3 text-gray-400" />
                                                    <div>
                                                      <p className="font-medium text-gray-700">
                                                        {item.productId
                                                          ?.productName ||
                                                          "N/A"}
                                                      </p>
                                                      {item.productId
                                                        ?.productCode && (
                                                        <p className="text-[10px] text-gray-400">
                                                          {
                                                            item.productId
                                                              .productCode
                                                          }
                                                        </p>
                                                      )}
                                                    </div>
                                                  </div>
                                                </td>
                                                <td className="px-3 py-2 text-center text-gray-700">
                                                  {item.quantity || 0}
                                                </td>
                                                <td className="px-3 py-2 text-center text-gray-700">
                                                  {item.returnUnits || 0}
                                                </td>
                                                <td className="px-3 py-2 text-right text-gray-700">
                                                  {functions.formatAsianNumber(
                                                    item.returnPrice || 0
                                                  )}
                                                </td>
                                                <td className="px-3 py-2 text-right font-semibold text-gray-800">
                                                  {functions.formatAsianNumber(
                                                    itemTotal
                                                  )}
                                                </td>
                                              </tr>
                                            );
                                          }
                                        )}
                                      </tbody>
                                      <tfoot>
                                        <tr className="bg-gray-50 font-semibold">
                                          <td
                                            colSpan="4"
                                            className="px-3 py-2 text-right text-gray-600"
                                          >
                                            Total Return Amount:
                                          </td>
                                          <td className="px-3 py-2 text-right text-red-600 font-bold">
                                            {functions.formatAsianNumber(
                                              saleReturn.totalReturnAmount
                                            )}
                                          </td>
                                        </tr>
                                      </tfoot>
                                    </table>
                                  </div>
                                </div>

                                {/* Additional Info */}
                                <div className="flex gap-4 text-[10px] text-gray-500">
                                  <span>
                                    <strong className="text-gray-600">
                                      Created:
                                    </strong>{" "}
                                    {formatDate(saleReturn.createdAt)}
                                  </span>
                                  {saleReturn.returnReason && (
                                    <span>
                                      <strong className="text-gray-600">
                                        Reason:
                                      </strong>{" "}
                                      {saleReturn.returnReason}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Totals */}
            {saleReturns.length > 0 && (
              <div className="bg-gray-50 border-t px-4 py-3 flex items-center justify-between">
                <p className="text-[10px] text-gray-500">
                  Showing {saleReturns.length} return
                  {saleReturns.length !== 1 ? "s" : ""}
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-600">
                    Total Items:{" "}
                    <strong className="text-gray-800">{totalItems}</strong>
                  </span>
                  <span className="text-xs text-gray-600">
                    Total Amount:{" "}
                    <strong className="text-red-600">
                      Rs. {functions.formatAsianNumber(totalReturnAmount)}
                    </strong>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Print Footer */}
          <div className="hidden print:block text-center mt-4">
            <p className="text-[10px] text-gray-500">
              Software by Pandas. 📞 03103480229 🌐 www.pandas.com.pk
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaleReturnList;
