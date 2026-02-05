/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { X, Printer, Check, ChevronDown, ChevronUp, Search } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { motion, AnimatePresence } from "framer-motion";
import functions from "../../../features/functions";

const AccountsPreviewModal = ({
  isOpen,
  onClose,
  accounts,
  getComputedBalance,
  businessName,
}) => {
  const [selectionType, setSelectionType] = useState("customers"); // customers, suppliers, all, custom
  const [selectedAccountIds, setSelectedAccountIds] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({
    customers: true,
    suppliers: true,
    companies: true,
    others: true,
  });
  const [customSearchTerm, setCustomSearchTerm] = useState("");

  const printRef = useRef();

  // Get all individual accounts flattened
  const getAllIndividualAccounts = () => {
    return accounts.flatMap((account) =>
      account.subCategories.flatMap((sub) =>
        sub.individualAccounts.filter(
          (individual) => !individual.mergedInto && !individual.isMerged
        )
      )
    );
  };

  // Categorize accounts
  const categorizeAccounts = () => {
    const allAccounts = getAllIndividualAccounts();
    return {
      customers: allAccounts.filter((acc) => acc.customerId),
      suppliers: allAccounts.filter((acc) => acc.supplierId),
      companies: allAccounts.filter((acc) => acc.companyId),
      others: allAccounts.filter(
        (acc) => !acc.customerId && !acc.supplierId && !acc.companyId
      ),
    };
  };

  const categorizedAccounts = categorizeAccounts();

  // Filter accounts based on search term for custom selection
  const getFilteredCategoryAccounts = (accounts) => {
    if (!customSearchTerm.trim()) return accounts;
    return accounts.filter((acc) =>
      acc.individualAccountName.toLowerCase().includes(customSearchTerm.toLowerCase())
    );
  };

  // Get accounts based on selection type
  const getSelectedAccounts = () => {
    if (selectionType === "customers") {
      return categorizedAccounts.customers;
    } else if (selectionType === "suppliers") {
      return [...categorizedAccounts.suppliers, ...categorizedAccounts.companies];
    } else if (selectionType === "all") {
      return getAllIndividualAccounts();
    } else if (selectionType === "custom") {
      const allAccounts = getAllIndividualAccounts();
      return allAccounts.filter((acc) => selectedAccountIds.includes(acc._id));
    }
    return [];
  };

  // Handle selection type change
  const handleSelectionTypeChange = (type) => {
    setSelectionType(type);
    if (type !== "custom") {
      setSelectedAccountIds([]);
    }
  };

  // Toggle individual account selection for custom mode
  const toggleAccountSelection = (accountId) => {
    setSelectedAccountIds((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    );
  };

  // Select/Deselect all in a category
  const toggleCategorySelection = (category, accounts) => {
    const categoryIds = accounts.map((acc) => acc._id);
    const allSelected = categoryIds.every((id) => selectedAccountIds.includes(id));

    if (allSelected) {
      setSelectedAccountIds((prev) => prev.filter((id) => !categoryIds.includes(id)));
    } else {
      setSelectedAccountIds((prev) => [...new Set([...prev, ...categoryIds])]);
    }
  };

  // Toggle category expand/collapse
  const toggleCategoryExpand = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Calculate totals
  const calculateTotals = () => {
    const selectedAccounts = getSelectedAccounts();
    let totalReceivables = 0;
    let totalPayables = 0;

    selectedAccounts.forEach((acc) => {
      const balance = getComputedBalance(acc);
      if (acc.customerId) {
        totalReceivables += balance;
      } else if (acc.supplierId || acc.companyId) {
        totalPayables += balance;
      } else {
        // For others, positive is receivable, negative is payable
        if (balance > 0) {
          totalReceivables += balance;
        } else {
          totalPayables += balance;
        }
      }
    });

    return { totalReceivables, totalPayables };
  };

  // Print functionality
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const { totalReceivables, totalPayables } = calculateTotals();
  const selectedAccounts = getSelectedAccounts();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">
              Accounts Preview for Print
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Selection Options */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleSelectionTypeChange("customers")}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  selectionType === "customers"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All Customers ({categorizedAccounts.customers.length})
              </button>
              <button
                onClick={() => handleSelectionTypeChange("suppliers")}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  selectionType === "suppliers"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All Suppliers & Companies (
                {categorizedAccounts.suppliers.length +
                  categorizedAccounts.companies.length}
                )
              </button>
              <button
                onClick={() => handleSelectionTypeChange("all")}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  selectionType === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All Accounts ({getAllIndividualAccounts().length})
              </button>
              <button
                onClick={() => handleSelectionTypeChange("custom")}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  selectionType === "custom"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Custom Selection{" "}
                {selectionType === "custom" && `(${selectedAccountIds.length})`}
              </button>
            </div>
          </div>

          {/* Custom Selection Panel */}
          {selectionType === "custom" && (
            <div className="p-4 border-b bg-gray-100 max-h-60 overflow-y-auto">
              <div className="flex items-center gap-3 mb-3">
                <p className="text-sm text-gray-600">
                  Select specific accounts to include in the preview:
                </p>
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search accounts..."
                    value={customSearchTerm}
                    onChange={(e) => setCustomSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Customers Category */}
              {categorizedAccounts.customers.length > 0 && (
                <div className="mb-3">
                  <div
                    className="flex items-center justify-between bg-green-100 p-2 rounded cursor-pointer"
                    onClick={() => toggleCategoryExpand("customers")}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={categorizedAccounts.customers.every((acc) =>
                          selectedAccountIds.includes(acc._id)
                        )}
                        onChange={() =>
                          toggleCategorySelection(
                            "customers",
                            categorizedAccounts.customers
                          )
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4"
                      />
                      <span className="font-medium text-green-800">
                        Customers ({categorizedAccounts.customers.length})
                        {customSearchTerm && ` - showing ${getFilteredCategoryAccounts(categorizedAccounts.customers).length}`}
                      </span>
                    </div>
                    {expandedCategories.customers ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                  {expandedCategories.customers && (
                    <div className="pl-6 pt-2 grid grid-cols-2 md:grid-cols-3 gap-1">
                      {getFilteredCategoryAccounts(categorizedAccounts.customers).map((acc) => (
                        <label
                          key={acc._id}
                          className="flex items-center gap-2 text-sm cursor-pointer hover:bg-green-50 p-1 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={selectedAccountIds.includes(acc._id)}
                            onChange={() => toggleAccountSelection(acc._id)}
                            className="w-3 h-3"
                          />
                          <span className="truncate">
                            {acc.individualAccountName}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Suppliers Category */}
              {categorizedAccounts.suppliers.length > 0 && (
                <div className="mb-3">
                  <div
                    className="flex items-center justify-between bg-red-100 p-2 rounded cursor-pointer"
                    onClick={() => toggleCategoryExpand("suppliers")}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={categorizedAccounts.suppliers.every((acc) =>
                          selectedAccountIds.includes(acc._id)
                        )}
                        onChange={() =>
                          toggleCategorySelection(
                            "suppliers",
                            categorizedAccounts.suppliers
                          )
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4"
                      />
                      <span className="font-medium text-red-800">
                        Suppliers ({categorizedAccounts.suppliers.length})
                        {customSearchTerm && ` - showing ${getFilteredCategoryAccounts(categorizedAccounts.suppliers).length}`}
                      </span>
                    </div>
                    {expandedCategories.suppliers ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                  {expandedCategories.suppliers && (
                    <div className="pl-6 pt-2 grid grid-cols-2 md:grid-cols-3 gap-1">
                      {getFilteredCategoryAccounts(categorizedAccounts.suppliers).map((acc) => (
                        <label
                          key={acc._id}
                          className="flex items-center gap-2 text-sm cursor-pointer hover:bg-red-50 p-1 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={selectedAccountIds.includes(acc._id)}
                            onChange={() => toggleAccountSelection(acc._id)}
                            className="w-3 h-3"
                          />
                          <span className="truncate">
                            {acc.individualAccountName}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Companies Category */}
              {categorizedAccounts.companies.length > 0 && (
                <div className="mb-3">
                  <div
                    className="flex items-center justify-between bg-orange-100 p-2 rounded cursor-pointer"
                    onClick={() => toggleCategoryExpand("companies")}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={categorizedAccounts.companies.every((acc) =>
                          selectedAccountIds.includes(acc._id)
                        )}
                        onChange={() =>
                          toggleCategorySelection(
                            "companies",
                            categorizedAccounts.companies
                          )
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4"
                      />
                      <span className="font-medium text-orange-800">
                        Companies ({categorizedAccounts.companies.length})
                        {customSearchTerm && ` - showing ${getFilteredCategoryAccounts(categorizedAccounts.companies).length}`}
                      </span>
                    </div>
                    {expandedCategories.companies ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                  {expandedCategories.companies && (
                    <div className="pl-6 pt-2 grid grid-cols-2 md:grid-cols-3 gap-1">
                      {getFilteredCategoryAccounts(categorizedAccounts.companies).map((acc) => (
                        <label
                          key={acc._id}
                          className="flex items-center gap-2 text-sm cursor-pointer hover:bg-orange-50 p-1 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={selectedAccountIds.includes(acc._id)}
                            onChange={() => toggleAccountSelection(acc._id)}
                            className="w-3 h-3"
                          />
                          <span className="truncate">
                            {acc.individualAccountName}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Others Category */}
              {categorizedAccounts.others.length > 0 && (
                <div className="mb-3">
                  <div
                    className="flex items-center justify-between bg-gray-200 p-2 rounded cursor-pointer"
                    onClick={() => toggleCategoryExpand("others")}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={categorizedAccounts.others.every((acc) =>
                          selectedAccountIds.includes(acc._id)
                        )}
                        onChange={() =>
                          toggleCategorySelection(
                            "others",
                            categorizedAccounts.others
                          )
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4"
                      />
                      <span className="font-medium text-gray-800">
                        Others ({categorizedAccounts.others.length})
                        {customSearchTerm && ` - showing ${getFilteredCategoryAccounts(categorizedAccounts.others).length}`}
                      </span>
                    </div>
                    {expandedCategories.others ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                  {expandedCategories.others && (
                    <div className="pl-6 pt-2 grid grid-cols-2 md:grid-cols-3 gap-1">
                      {getFilteredCategoryAccounts(categorizedAccounts.others).map((acc) => (
                        <label
                          key={acc._id}
                          className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 p-1 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={selectedAccountIds.includes(acc._id)}
                            onChange={() => toggleAccountSelection(acc._id)}
                            className="w-3 h-3"
                          />
                          <span className="truncate">
                            {acc.individualAccountName}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Preview Content */}
          <div className="flex-1 overflow-auto p-4">
            <div ref={printRef} className="bg-white p-4">
              {/* Print Header */}
              <div className="text-center mb-4 border-b pb-3">
                <h1 className="text-xl font-bold">{businessName}</h1>
                <h2 className="text-lg text-gray-600">
                  {selectionType === "customers" && "Customer Accounts"}
                  {selectionType === "suppliers" && "Supplier & Company Accounts"}
                  {selectionType === "all" && "All Accounts"}
                  {selectionType === "custom" && "Selected Accounts"}
                </h2>
                <p className="text-sm text-gray-500">
                  Generated on: {new Date().toLocaleDateString()}
                </p>
              </div>

              {/* Accounts Table */}
              {selectedAccounts.length > 0 ? (
                <table className="w-full text-sm border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 p-2 text-left">#</th>
                      <th className="border border-gray-300 p-2 text-left">
                        Account Name
                      </th>
                      <th className="border border-gray-300 p-2 text-left">Type</th>
                      <th className="border border-gray-300 p-2 text-right">
                        Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedAccounts.map((acc, index) => {
                      const balance = getComputedBalance(acc);
                      const type = acc.customerId
                        ? "Customer"
                        : acc.supplierId
                        ? "Supplier"
                        : acc.companyId
                        ? "Company"
                        : "Other";

                      return (
                        <tr key={acc._id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 p-2">
                            {index + 1}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {acc.individualAccountName}
                          </td>
                          <td className="border border-gray-300 p-2">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                type === "Customer"
                                  ? "bg-green-100 text-green-800"
                                  : type === "Supplier"
                                  ? "bg-red-100 text-red-800"
                                  : type === "Company"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {type}
                            </span>
                          </td>
                          <td
                            className={`border border-gray-300 p-2 text-right font-medium ${
                              balance > 0
                                ? "text-green-600"
                                : balance < 0
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
                          >
                            {functions.formatAsianNumber(balance)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 font-bold">
                      <td
                        colSpan="3"
                        className="border border-gray-300 p-2 text-right"
                      >
                        Total Receivables:
                      </td>
                      <td className="border border-gray-300 p-2 text-right text-green-600">
                        {functions.formatAsianNumber(totalReceivables)}
                      </td>
                    </tr>
                    <tr className="bg-gray-100 font-bold">
                      <td
                        colSpan="3"
                        className="border border-gray-300 p-2 text-right"
                      >
                        Total Payables:
                      </td>
                      <td className="border border-gray-300 p-2 text-right text-red-600">
                        {functions.formatAsianNumber(totalPayables)}
                      </td>
                    </tr>
                    <tr className="bg-gray-200 font-bold">
                      <td
                        colSpan="3"
                        className="border border-gray-300 p-2 text-right"
                      >
                        Net Balance:
                      </td>
                      <td
                        className={`border border-gray-300 p-2 text-right ${
                          totalReceivables + totalPayables >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {functions.formatAsianNumber(totalReceivables + totalPayables)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  {selectionType === "custom"
                    ? "Please select accounts to preview"
                    : "No accounts found"}
                </div>
              )}

              {/* Footer */}
              <p className="text-center text-[10px] mt-4 text-gray-500">
                Software by Pandas. 📞 03103480229 🌐 www.pandas.com.pk
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between p-4 border-t bg-gray-50">
            <div className="text-sm text-gray-600">
              Showing {selectedAccounts.length} account(s)
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePrint}
                disabled={selectedAccounts.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AccountsPreviewModal;
