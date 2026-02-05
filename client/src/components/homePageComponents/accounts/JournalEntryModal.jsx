/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import config from "../../../features/config"; // adjust path if different
import { extractErrorMessage } from "../../../utils/extractErrorMessage"; // adjust if you have this util
import { showSuccessToast, showErrorToast } from "../../../utils/toast";
import JournalEntrySlipModal from "./JournalEntrySlipModal";

const JournalEntryModal = ({ account, accountBalance = 0, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    accountId: "",
    amount: "",
    description: "",
    details: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [slipData, setSlipData] = useState(null);

  // console.log('account', account)

  // Automatically fill account info when modal opens
  useEffect(() => {
    if (account) {
      setFormData((prev) => ({
        ...prev,
        accountId: account._id || account.accountId || "",
      }));
    }
  }, [account]);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit logic (auto-detect endpoint)
  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let response;

      // Prepare slip data
      // For customers: payment reduces their balance (debit to cash, credit to customer)
      // For vendors: payment reduces our liability (debit to vendor, credit to cash)
      const isCustomer = !!account?.customerId;
      const amountNum = parseFloat(formData.amount) || 0;
      const previousBalance = accountBalance;
      // Customer payment: balance decreases (they owed us, now paid)
      // Vendor payment: balance increases (we owed them, we paid - balance goes toward 0)
      const remainingBalance = isCustomer 
        ? previousBalance - amountNum 
        : previousBalance + amountNum;

      const entrySlipData = {
        accountName: account?.individualAccountName,
        amount: formData.amount,
        description: formData.description,
        details: formData.details,
        customerId: account?.customerId,
        supplierId: account?.supplierId,
        companyId: account?.companyId,
        previousBalance: previousBalance,
        remainingBalance: remainingBalance,
      };

      if (account.customerId) {
        response = await config.postCustomerJournalEntry({
          customerAccountId: formData.accountId,
          amount: formData.amount,
          description: formData.description,
          details: formData.details,
        });

        if (response) {
          setSuccess("Customer journal entry recorded successfully!");
          showSuccessToast("Customer journal entry recorded successfully!");
          setSlipData(entrySlipData);
          if (onSuccess) onSuccess();
          setShowSlipModal(true);
        }

      } else if (account.supplierId || account.companyId) {
        response = await config.postVendorJournalEntry({
          vendorAccountId: formData.accountId,
          amount: formData.amount,
          description: formData.description,
          details: formData.details,
        });

        if (response) {
          setSuccess("Vendor journal entry recorded successfully!");
          showSuccessToast("Vendor journal entry recorded successfully!");
          setSlipData(entrySlipData);
          if (onSuccess) onSuccess();
          setShowSlipModal(true);
        }

      } else if (account.accountType === "expense") {
        response = await config.postExpense({
          accountId: formData.accountId,
          amount: formData.amount,
          description: formData.description,
        });

        if (response?.data) {
          setSuccess("Expense recorded successfully!");
          showSuccessToast("Expense recorded successfully!");
          setSlipData(entrySlipData);
          if (onSuccess) onSuccess();
          setShowSlipModal(true);
        }
      } else {
        setError("Unsupported account type for journal entry.");
        showErrorToast("Unsupported account type for journal entry.");
      }

      // Don't reset form here - keep data for slip preview

    } catch (err) {
      console.error("Error recording journal entry:", err);
      const message = extractErrorMessage(err);
      setError(message);
      showErrorToast(message || "Failed to record journal entry");
    } finally {
      setLoading(false);
    }
  };

  const handleSlipClose = () => {
    setShowSlipModal(false);
    setSlipData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[420px]">
        <h2 className="text-lg font-semibold mb-4 text-center">
          {account?.accountType
            ? `${account.accountType.charAt(0).toUpperCase()}${account.accountType.slice(1)}`
            : "General"}{" "}
          Journal Entry
        </h2>

        <div className="space-y-3">
          <input
            name="accountName"
            value={account?.individualAccountName || ""}
            disabled
            className="w-full p-2 border rounded bg-gray-100 text-gray-700"
          />

          <input
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            type="number"
            className="w-full p-2 border rounded"
          />

          <input
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-2 border rounded"
          />

          {account?.accountType !== "expense" && (
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              placeholder="Details (optional)"
              className="w-full p-2 border rounded resize-none"
            ></textarea>
          )}

          {success && (
            <p className="text-green-600 text-sm mt-1">{success}</p>
          )}
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-3 py-1 rounded text-white ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Slip Preview Modal for Thermal Printing */}
      <JournalEntrySlipModal
        isOpen={showSlipModal}
        onClose={handleSlipClose}
        entryData={slipData}
      />
    </div>
  );
};

export default JournalEntryModal;
