/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import config from "../../../features/config";
import functions from "../../../features/functions";
import Loader from "../../../pages/Loader";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  X,
  Printer,
  Calendar,
  Filter,
  BarChart3,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";

const ITEMS_PER_PAGE = 50;

const TransactionHistory = () => {
  const [ledgerData, setLedgerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // all, debit, credit
  const [dateFrom, setDateFrom] = useState(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return thirtyDaysAgo.toISOString().split('T')[0];
  });
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().split('T')[0]);
  const [currentPage, setCurrentPage] = useState(1);

  const userData = useSelector((state) => state.auth.userData);
  const printRef = useRef();

  const fetchLedgerData = async () => {
    setLoading(true);
    try {
      const response = await config.getGeneralLedger();
      if (response?.data) {
        setLedgerData(response.data);
      }
    } catch (error) {
      console.error("Error fetching ledger data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedgerData();
  }, []);

  // Filtered & sorted transactions
  const filteredData = ledgerData.filter((entry) => {
    // Search filter
    const search = searchTerm.toLowerCase();
    const nameMatch =
      entry.referenceAccount?.name?.toLowerCase().includes(search) ||
      entry.individualAccount?.name?.toLowerCase().includes(search) ||
      entry.details?.toLowerCase().includes(search) ||
      entry.description?.toLowerCase().includes(search);

    if (searchTerm && !nameMatch) return false;

    // Type filter
    if (typeFilter === "debit" && !entry.debit) return false;
    if (typeFilter === "credit" && !entry.credit) return false;

    // Date filter
    if (dateFrom) {
      const entryDate = new Date(entry.createdAt).setHours(0, 0, 0, 0);
      const fromDate = new Date(dateFrom).setHours(0, 0, 0, 0);
      if (entryDate < fromDate) return false;
    }
    if (dateTo) {
      const entryDate = new Date(entry.createdAt).setHours(23, 59, 59, 999);
      const toDate = new Date(dateTo).setHours(23, 59, 59, 999);
      if (entryDate > toDate) return false;
    }

    return true;
  });

  // Sort by date descending (most recent first)
  const sortedData = [...filteredData].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Pagination
  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Summary stats
  const totalDebit = filteredData.reduce(
    (sum, e) => sum + (Number(e.debit) || 0),
    0
  );
  const totalCredit = filteredData.reduce(
    (sum, e) => sum + (Number(e.credit) || 0),
    0
  );

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handleReset = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

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

  const formatShortDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-PK", {
      timeZone: "Asia/Karachi",
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  // Group transactions by date for visual separation
  let lastDate = "";

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">
              Transaction History
            </h1>
            <p className="text-xs text-gray-500">
              All ledger transactions across accounts
            </p>
          </div>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition text-gray-700"
        >
          <Printer className="w-3.5 h-3.5" />
          Print
        </button>
      </div>

      {/* Filters Bar */}
      <div className="px-5 py-3 bg-white border-b">
        <div className="flex flex-wrap items-end gap-3">
          {/* Search */}
          <div className="flex flex-col gap-1 flex-1 min-w-[200px] max-w-[300px]">
            <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Account, detail, description..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none"
              />
            </div>
          </div>

          {/* Date From */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
              From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none"
            />
          </div>

          {/* Date To */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
              To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none"
            />
          </div>

          {/* Type Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none min-w-[110px]"
            >
              <option value="all">All</option>
              <option value="debit">Debit Only</option>
              <option value="credit">Credit Only</option>
            </select>
          </div>

          {/* Clear */}
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
          <div className="p-2 rounded-lg bg-indigo-50">
            <FileText className="w-4 h-4 text-indigo-500" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">
              Transactions
            </p>
            <p className="text-lg font-bold text-gray-800">
              {filteredData.length.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-50">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">
              Total Debit
            </p>
            <p className="text-lg font-bold text-emerald-700">
              {functions.formatAsianNumber(totalDebit)}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-50">
            <TrendingDown className="w-4 h-4 text-rose-500" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">
              Total Credit
            </p>
            <p className="text-lg font-bold text-rose-700">
              {functions.formatAsianNumber(totalCredit)}
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-10">
          <Loader
            h_w="h-10 w-10 border-t-3 border-b-3"
            message="Loading transactions..."
          />
        </div>
      )}

      {/* Transaction Table */}
      {!loading && (
        <div className="px-5 pb-5">
          <div
            ref={printRef}
            className="bg-white rounded-xl border shadow-sm overflow-hidden"
          >
            {/* Print Header */}
            <div className="hidden print:block p-4 border-b text-center">
              <h2 className="text-sm font-bold">
                {userData?.BusinessId?.businessName}
              </h2>
              <p className="text-xs text-gray-600">Transaction History</p>
              {(dateFrom || dateTo) && (
                <p className="text-[10px] text-gray-500">
                  {dateFrom || "Start"} to {dateTo || "Present"}
                </p>
              )}
            </div>

            <div className="overflow-auto max-h-[52vh] scrollbar-thin">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider w-8">
                      #
                    </th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Account
                    </th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Detail
                    </th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Debit
                    </th>
                    <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Credit
                    </th>
                    <th className="text-center px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-12 text-gray-400"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <BarChart3 className="w-8 h-8 text-gray-300" />
                          <p className="text-sm font-medium">
                            No transactions found
                          </p>
                          <p className="text-[10px]">
                            Try adjusting your filters or date range
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((entry, index) => {
                      const entryDate = formatShortDate(entry.createdAt);
                      const showDateHeader = entryDate !== lastDate;
                      lastDate = entryDate;
                      const isDebit = entry.debit && entry.debit > 0;
                      const globalIndex =
                        (currentPage - 1) * ITEMS_PER_PAGE + index + 1;

                      return (
                        <React.Fragment key={entry._id}>
                          {/* Date separator */}
                          {showDateHeader && (
                            <tr className="print:hidden">
                              <td
                                colSpan="8"
                                className="px-4 py-1.5 bg-indigo-50/50"
                              >
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-3 h-3 text-indigo-400" />
                                  <span className="text-[10px] font-semibold text-indigo-600">
                                    {entryDate}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          )}
                          <tr className="hover:bg-gray-50/80 transition">
                            <td className="px-4 py-2 text-gray-400 font-medium text-[10px]">
                              {globalIndex}
                            </td>
                            <td className="px-4 py-2 text-gray-600 whitespace-nowrap">
                              {formatDate(entry.createdAt)}
                            </td>
                            <td className="px-4 py-2">
                              <div>
                                <p className="font-medium text-gray-800 truncate max-w-[180px]">
                                  {entry.referenceAccount?.name || "—"}
                                </p>
                                {entry.account?.name && (
                                  <p className="text-[10px] text-gray-400 truncate max-w-[180px]">
                                    {entry.account.name}{" "}
                                    {entry.accountSubCategory?.name
                                      ? `› ${entry.accountSubCategory.name}`
                                      : ""}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-2 text-gray-700 max-w-[200px]">
                              <p className="truncate">
                                {entry.details || "—"}
                              </p>
                            </td>
                            <td className="px-4 py-2 text-gray-500 max-w-[160px]">
                              <p className="truncate">
                                {entry.description || "—"}
                              </p>
                            </td>
                            <td className="px-4 py-2 text-right">
                              {entry.debit && entry.debit > 0 ? (
                                <span className="font-semibold text-emerald-700">
                                  {functions.formatAsianNumber(entry.debit)}
                                </span>
                              ) : (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>
                            <td className="px-4 py-2 text-right">
                              {entry.credit && entry.credit > 0 ? (
                                <span className="font-semibold text-rose-600">
                                  {functions.formatAsianNumber(entry.credit)}
                                </span>
                              ) : (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>
                            <td className="px-4 py-2 text-center">
                              {isDebit ? (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <ArrowUpRight className="w-2.5 h-2.5" />
                                  DR
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                                  <ArrowDownLeft className="w-2.5 h-2.5" />
                                  CR
                                </span>
                              )}
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer - Pagination & Totals */}
            {sortedData.length > 0 && (
              <div className="bg-gray-50 border-t px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <p className="text-[10px] text-gray-500">
                    Showing{" "}
                    {((currentPage - 1) * ITEMS_PER_PAGE + 1).toLocaleString()}{" "}
                    -{" "}
                    {Math.min(
                      currentPage * ITEMS_PER_PAGE,
                      sortedData.length
                    ).toLocaleString()}{" "}
                    of {sortedData.length.toLocaleString()}
                  </p>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="p-1 rounded hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        <ChevronLeft className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                      {/* Page numbers */}
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let page;
                        if (totalPages <= 5) {
                          page = i + 1;
                        } else if (currentPage <= 3) {
                          page = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          page = totalPages - 4 + i;
                        } else {
                          page = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-6 h-6 rounded text-[10px] font-medium transition ${
                              currentPage === page
                                ? "bg-indigo-600 text-white"
                                : "text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="p-1 rounded hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-5">
                  <span className="text-xs text-gray-600">
                    Debit:{" "}
                    <strong className="text-emerald-700">
                      {functions.formatAsianNumber(totalDebit)}
                    </strong>
                  </span>
                  <span className="text-xs text-gray-600">
                    Credit:{" "}
                    <strong className="text-rose-600">
                      {functions.formatAsianNumber(totalCredit)}
                    </strong>
                  </span>
                  <span className="text-xs text-gray-600">
                    Net:{" "}
                    <strong
                      className={
                        totalDebit - totalCredit >= 0
                          ? "text-emerald-700"
                          : "text-rose-600"
                      }
                    >
                      {functions.formatAsianNumber(
                        Math.abs(totalDebit - totalCredit)
                      )}{" "}
                      {totalDebit - totalCredit >= 0 ? "DR" : "CR"}
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

export default TransactionHistory;
