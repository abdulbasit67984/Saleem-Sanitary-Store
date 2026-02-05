/* eslint-disable react/prop-types */
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { X, Printer } from "lucide-react";
import { useSelector } from "react-redux";
import functions from "../../../features/functions";

const JournalEntrySlipModal = ({ isOpen, onClose, entryData }) => {
  const printRef = useRef();
  const userData = useSelector((state) => state.auth.userData);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => {
      // Optionally close modal after printing
    },
  });

  if (!isOpen || !entryData) return null;

  const currentDate = new Date().toLocaleString("en-PK", {
    timeZone: "Asia/Karachi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const entryType = entryData.customerId
    ? "Customer Payment"
    : entryData.supplierId || entryData.companyId
    ? "Vendor Payment"
    : "Journal Entry";

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[60]">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Print Slip</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Slip Preview - Thermal Format (80mm width) */}
        <div className="p-4 max-h-[70vh] overflow-auto">
          <div
            ref={printRef}
            className="bg-white w-[80mm] mx-auto p-3 text-black border shadow-md"
            style={{ fontFamily: "monospace" }}
          >
            {/* Business Header */}
            <div className="text-center border-b border-dashed border-gray-400 pb-2 mb-2">
              <h2 className="text-sm font-bold uppercase">
                {userData?.BusinessId?.businessName || "Business Name"}
              </h2>
              <p className="text-[10px]">
                {userData?.BusinessId?.businessRegion || ""}
              </p>
              <p className="text-[10px]">
                {userData?.BusinessId?.owner?.mobileno?.map((num, i) => (
                  <span className="px-1" key={i}>
                    {num}
                  </span>
                ))}
              </p>
            </div>

            {/* Slip Title */}
            <div className="text-center mb-3">
              <h3 className="text-xs font-bold border border-gray-400 inline-block px-3 py-1 rounded">
                {entryType}
              </h3>
            </div>

            {/* Entry Details */}
            <div className="text-[10px] space-y-1 border-b border-dashed border-gray-400 pb-2 mb-2">
              <div className="flex justify-between">
                <span className="font-semibold">Date:</span>
                <span>{currentDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Account:</span>
                <span className="text-right max-w-[50%] truncate">
                  {entryData.accountName || entryData.individualAccountName}
                </span>
              </div>
            </div>

            {/* Previous Balance */}
            {entryData.previousBalance !== undefined && (
              <div className="flex justify-between text-[10px] mb-1">
                <span className="font-semibold">Previous Balance:</span>
                <span>Rs. {functions.formatAsianNumber(entryData.previousBalance || 0)}</span>
              </div>
            )}

            {/* Amount Section */}
            <div className="bg-gray-100 p-2 rounded mb-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Amount {entryData.customerId ? "Received" : "Paid"}:</span>
                <span className="text-base">
                  Rs. {functions.formatAsianNumber(entryData.amount || 0)}
                </span>
              </div>
            </div>

            {/* Remaining Balance */}
            {entryData.remainingBalance !== undefined && (
              <div className="bg-yellow-50 border border-yellow-300 p-2 rounded mb-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Remaining Balance:</span>
                  <span className="text-base">
                    Rs. {functions.formatAsianNumber(entryData.remainingBalance || 0)}
                  </span>
                </div>
              </div>
            )}

            {/* Description & Details */}
            {entryData.description && (
              <div className="text-[10px] mb-1">
                <span className="font-semibold">Description: </span>
                <span>{entryData.description}</span>
              </div>
            )}

            {entryData.details && (
              <div className="text-[10px] mb-2">
                <span className="font-semibold">Details: </span>
                <span>{entryData.details}</span>
              </div>
            )}

            {/* Entry Type Indicator */}
            <div className="text-[10px] border-t border-dashed border-gray-400 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-semibold">Entry Type:</span>
                <span>
                  {entryData.customerId
                    ? "Payment Received"
                    : entryData.supplierId || entryData.companyId
                    ? "Payment Made"
                    : "Adjustment"}
                </span>
              </div>
            </div>


            {/* Footer */}
            <div className="text-center mt-4 pt-2 border-t border-dashed border-gray-400">
              <p className="text-[9px] text-gray-600">Thank you!</p>
              <p className="text-[8px] text-gray-500 mt-1">
                Software by Pandas. 📞 03103480229
              </p>
              <p className="text-[8px] text-gray-500">🌐 www.pandas.com.pk</p>
            </div>
          </div>
        </div>

        {/* Modal Footer - Actions */}
        <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <Printer className="w-4 h-4" />
            Print Slip
          </button>
        </div>
      </div>
    </div>
  );
};

export default JournalEntrySlipModal;
