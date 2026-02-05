/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { addQuotation } from "../../../../utils/quotationStorage.js";
import Button from "../../../Button";
import { showWarningToast, showSuccessToast } from "../../../../utils/toast";

// Expect full invoice state props so we can restore later
export default function QuotationComponent({
  description,
  billType,
  billPaymentType,
  customerId,
  selectedItems,
  flatDiscount,
  totalAmount,
  paidAmount,
  dueDate,
  extraProducts,
}) {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");

  const handleSave = () => {
    if (!name.trim()) {
      showWarningToast("Please enter a quotation name.");
      return;
    }

    // Full payload, but still compatible with older minimal code (items/total)
    const quotation = {
      id: Date.now(),
      name: name.trim(),
      createdAt: new Date().toISOString(),

      // Minimal fields (backward compatible consumers)
      items: selectedItems || [],
      total: Number(totalAmount) || 0,

      // Full restore payload for invoice
      payload: {
        description: description || "",
        billType: billType || "",
        billPaymentType: billPaymentType || "",
        customer: customerId ?? null,
        billItems: (selectedItems || []).map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          billItemDiscount: item.discount,
          billItemPrice: item.salePrice1,
          billItemPack: item.productPack,
          billItemUnit: item.billItemUnit,
        })),
        flatDiscount: Number(flatDiscount) || 0,
        totalAmount: Number(totalAmount) || 0,
        paidAmount: Number(paidAmount) || 0,
        dueDate: dueDate || "",
        extraItems: extraProducts || [],
        // keep raw selected items in case you prefer direct restore
        _rawSelectedItems: selectedItems || [],
      },
    };

    addQuotation(quotation);
    setShow(false);
    setName("");
    showSuccessToast("Quotation saved successfully!");
  };

  return (
    <div className="inline-block w-full">
      <Button
        onClick={() => setShow(true)}
        className=" hover:bg-purple-700 w-full text-white px-4 py-2 rounded"
      >
        Save as Quotation
      </Button>


      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-96 rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Save Quotation</h2>
            <input
              type="text"
              className="border rounded w-full p-2 mb-4 text-sm"
              placeholder="Enter quotation name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShow(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
