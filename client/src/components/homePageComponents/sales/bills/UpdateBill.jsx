/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import config from "../../../../features/config";
import Input from "../../../Input";
import Button from "../../../Button";
import Loader from "../../../../pages/Loader";
import DeleteConfirmation from "../../../DeleteConfirmation";
import UpdateConfirmation from "../../../UpdateConfirmation";
import { showSuccessToast, showErrorToast } from "../../../../utils/toast";
import ConfirmationModal from "../../../ConfirmationModal";

const UpdateBill = ({ billId, setIsEditing }) => {
  const [billData, setBillData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isSavePopupOpen, setSavePopupOpen] = useState(false);
  const [itemIndex, setItemIndex] = useState(null);

  // Add new product item state
  const allProducts = useSelector((state) => state.saleItems.allProducts);
  const [newItemSearch, setNewItemSearch] = useState("");
  const [newItemMatches, setNewItemMatches] = useState([]);
  const [selectedNewProduct, setSelectedNewProduct] = useState(null);
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemPrice, setNewItemPrice] = useState(0);
  const [newItemDiscount, setNewItemDiscount] = useState(0);

  // Confirmation modal state for extra item delete
  const [showDeleteExtraConfirm, setShowDeleteExtraConfirm] = useState(false);
  const [extraItemIndexToDelete, setExtraItemIndexToDelete] = useState(null);

  const customerData = useSelector((state) => state.customers.customerData);

  useEffect(() => {
    const query = newItemSearch.trim().toLowerCase();
    if (!query) {
      setNewItemMatches([]);
      return;
    }

    const matches = (allProducts || [])
      .filter((p) => {
        const name = p?.productName?.toLowerCase() || "";
        const code = p?.productCode?.toLowerCase() || "";
        return name.includes(query) || code.includes(query);
      })
      .slice(0, 12);

    setNewItemMatches(matches);
  }, [newItemSearch, allProducts]);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        setIsLoading(true);
        const response = await config.fetchSingleBill(billId);
        if (response && response.data) {
          setBillData(response.data);
        }
      } catch (err) {
        setError("Failed to fetch bill data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBill();
  }, [billId]);

  const handleItemChange = (index, key, value) => {
    const updatedItems = (billData.billItems || []).map((item, i) =>
      i === index ? { ...item, [key]: value } : item
    );

    setBillData({ ...billData, billItems: updatedItems });
  };

  const handleExtraItemChange = (index, key, value) => {
    const updatedExtras = (billData.extraItems || []).map((item, i) =>
      i === index ? { ...item, [key]: value } : item
    );

    setBillData({ ...billData, extraItems: updatedExtras });
  };

  const handleSelectNewProduct = (product) => {
    setSelectedNewProduct(product);
    setNewItemSearch(product?.productName || "");
    setNewItemMatches([]);
    setNewItemQuantity(1);
    const defaultPrice =
      Number(product?.salePriceDetails?.[0]?.salePrice1) ||
      Number(product?.salePrice1) ||
      0;
    setNewItemPrice(defaultPrice);
    setNewItemDiscount(0);
  };

  const handleAddNewBillItem = () => {
    if (!billData) return;
    if (!selectedNewProduct?._id) {
      showErrorToast("Please select a product to add.");
      return;
    }

    const qty = Number(newItemQuantity) || 0;
    const price = Number(newItemPrice) || 0;
    const discount = Number(newItemDiscount) || 0;

    if (qty <= 0) {
      showErrorToast("Quantity must be greater than 0.");
      return;
    }

    const existingIndex = (billData.billItems || []).findIndex((it) => {
      const id = it?.productId?._id || it?.productId;
      return id?.toString?.() === selectedNewProduct._id?.toString?.();
    });

    const newItem = {
      productId: selectedNewProduct,
      quantity: qty,
      billItemPrice: price,
      billItemDiscount: discount,
      billItemPack: Number(selectedNewProduct?.productPack) || 1,
      billItemUnit: 0,
    };

    if (existingIndex >= 0) {
      const updatedItems = (billData.billItems || []).map((it, idx) => {
        if (idx !== existingIndex) return it;
        return {
          ...it,
          quantity: (Number(it.quantity) || 0) + qty,
          billItemPrice: price,
          billItemDiscount: discount,
          billItemPack: it.billItemPack ?? newItem.billItemPack,
          billItemUnit: it.billItemUnit ?? 0,
        };
      });
      setBillData({ ...billData, billItems: updatedItems });
      showSuccessToast("Item added (quantity updated).");
    } else {
      const updatedItems = [...(billData.billItems || []), newItem];
      setBillData({ ...billData, billItems: updatedItems });
      showSuccessToast("Item added to bill.");
    }

    setSelectedNewProduct(null);
    setNewItemSearch("");
    setNewItemQuantity(1);
    setNewItemPrice(0);
    setNewItemDiscount(0);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = (billData.billItems || []).filter((_, i) => i !== index);
    setBillData({ ...billData, billItems: updatedItems });
    setPopupOpen(false);
  };

  const handleDeleteExtra = (index) => {
    setExtraItemIndexToDelete(index);
    setShowDeleteExtraConfirm(true);
  };

  const confirmDeleteExtra = () => {
    const updatedExtras = (billData.extraItems || []).filter((_, i) => i !== extraItemIndexToDelete);
    setBillData({ ...billData, extraItems: updatedExtras });
    setShowDeleteExtraConfirm(false);
    setExtraItemIndexToDelete(null);
    showSuccessToast('Extra item removed!');
  };

  const calculateTotals = () => {
    const items = billData?.billItems || [];
    const extras = billData?.extraItems || [];
    let totalAmount = 0;
    let totalDiscount = 0;

    items.forEach((item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.billItemPrice) || 0;
      const discountPercent = Number(item.billItemDiscount) || 0;

      const itemTotal = qty * price;
      const itemDiscount = (itemTotal * discountPercent) / 100;

      totalAmount += itemTotal;
      totalDiscount += itemDiscount;
    });

    extras.forEach((item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.salePrice) || 0;
      const itemTotal = qty * price;
      totalAmount += itemTotal;
      // extras currently have no discount field
    });

    const paid = Number(billData?.paidAmount) || 0;
    const flat = Number(billData?.flatDiscount) || 0;
    const outstanding = totalAmount - paid - flat;

    return {
      totalAmount: totalAmount.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      outstandingAmount: outstanding.toFixed(2),
    };
  };

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      const totals = calculateTotals();
      const updatedBill = {
        ...billData,
        customer: billData?.customer?._id || billData?.customer,
        paidAmount: Number(billData?.paidAmount) || 0,
        flatDiscount: Number(billData?.flatDiscount) || 0,
        totalAmount: Number(totals.totalAmount),
        totalDiscount: Number(totals.totalDiscount),
      };

      await config.updateInvoice(updatedBill);
      showSuccessToast("Bill updated successfully!");
    } catch (err) {
      setError("Failed to update the bill.");
      showErrorToast("Failed to update the bill.");
    } finally {
      setIsLoading(false);
      setSavePopupOpen(false);
    }
  };

  if (isLoading)
    return <Loader message="Loading Bill Please Wait...." mt="" h_w="h-10 w-10 border-t-2 border-b-2" />;
  if (error) return <p className="text-red-500">{error}</p>;

  return isPopupOpen ? (
    <DeleteConfirmation
      message="Are you sure you want to delete this item?"
      onConfirm={() => handleDeleteItem(itemIndex)}
      onCancel={() => setPopupOpen(false)}
      isOpen={isPopupOpen}
    />
  ) : isSavePopupOpen ? (
    <UpdateConfirmation
      message="Are you sure you want to update the bill?"
      onConfirm={() => handleSaveChanges()}
      onCancel={() => setSavePopupOpen(false)}
      isOpen={isSavePopupOpen}
    />
  ) : (
    <div className="px-4 py-2 bg-white shadow-md rounded">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold mb-1">Edit Bill</h2>
        <button className="hover:text-red-700 mb-1" onClick={() => setIsEditing(false)}>
          <span>&#10008;</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <Input className="p-1" label="Bill No:" labelClass="w-28" value={billData.billNo} readOnly />
        <Input
          className="p-1"
          label="Payment Due Date:"
          labelClass="w-28"
          type="date"
          value={billData.dueDate}
          onChange={(e) => setBillData({ ...billData, dueDate: e.target.value })}
        />
        <Input
          className="p-1"
          label="Flat Discount:"
          labelClass="w-28"
          type="number"
          value={billData.flatDiscount}
          onChange={(e) => setBillData({ ...billData, flatDiscount: e.target.value })}
        />
        <Input
          className="p-1"
          label="Paid Amount:"
          labelClass="w-28"
          type="number"
          value={billData.paidAmount}
          onChange={(e) => setBillData({ ...billData, paidAmount: e.target.value })}
        />
        <Input
          className="p-1"
          label="Description:"
          placeholder="Enter description"
          labelClass="w-28"
          value={billData.description}
          onChange={(e) => setBillData({ ...billData, description: e.target.value })}
        />
        <label className="ml-1 flex items-center">
          <span className="w-28">Customer:</span>
          <select
            className="border p-1 rounded text-xs w-44"
            onChange={(e) => setBillData({ ...billData, customer: e.target.value })}
            value={billData?.customer?._id || billData?.customer || ""}
            disabled={true}
          >
            <option value="">{billData.customer?.customerName}</option>
            {customerData?.map((customer, index) => (
              <option key={index} value={customer._id}>
                {customer.customerName}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="border-b my-3"></div>

      {/* Add new item */}
      <div className="mb-3 text-xs">
        <h3 className="text-sm font-semibold mb-2">Add New Item</h3>
        <div className="grid grid-cols-3 gap-2 items-end">
          <div className="col-span-1 relative">
            <Input
              className="p-1"
              label="Search Product:"
              labelClass="w-28"
              value={newItemSearch}
              placeholder="Type name/code"
              onChange={(e) => {
                setNewItemSearch(e.target.value);
                setSelectedNewProduct(null);
              }}
            />

            {newItemMatches.length > 0 && (
              <div className="absolute z-10 bg-white border rounded shadow-md w-full max-h-48 overflow-auto">
                {newItemMatches.map((p) => (
                  <button
                    type="button"
                    key={p._id}
                    className="w-full text-left px-2 py-1 hover:bg-gray-100"
                    onClick={() => handleSelectNewProduct(p)}
                  >
                    <div className="flex justify-between">
                      <span className="truncate">{p.productName}</span>
                      <span className="text-gray-500">{p.salePriceDetails?.[0]?.salePrice1}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Input
            className="p-1"
            label="Qty:"
            labelClass="w-28"
            type="number"
            value={newItemQuantity}
            onChange={(e) => setNewItemQuantity(e.target.value)}
          />
          <Input
            className="p-1"
            label="Price/Unit:"
            labelClass="w-28"
            type="number"
            value={newItemPrice}
            onChange={(e) => setNewItemPrice(e.target.value)}
          />
          <Input
            className="p-1"
            label="Discount %:"
            labelClass="w-28"
            type="number"
            value={newItemDiscount}
            onChange={(e) => setNewItemDiscount(e.target.value)}
          />
          <div className="col-span-2 flex justify-end">
            <Button className="p-1 px-2" onClick={handleAddNewBillItem}>
              Add Item
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <h3 className="text-sm font-semibold mb-2">Purchase Items</h3>
        <div className="max-h-72 overflow-y-auto scrollbar-thin">
          <table className="w-full text-xs border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Product Name</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Price/Unit</th>
                <th className="border p-2">Discount %</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {billData?.billItems?.map((item, index) => (
                <tr key={index} className="border">
                  <td className="border p-2">{item.productId.productName}</td>
                  <td className="border p-2">
                    <Input
                      type="number"
                      className="p-1 text-right "
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    />
                  </td>
                  <td className="border p-2">
                    <Input
                      type="number"
                      className="p-1 text-right "
                      value={item.billItemPrice}
                      onChange={(e) => handleItemChange(index, "billItemPrice", e.target.value)}
                    />
                  </td>
                  <td className="border p-2">
                    <Input
                      type="number"
                      className="p-1 text-right "
                      value={item.billItemDiscount}
                      onChange={(e) => handleItemChange(index, "billItemDiscount", e.target.value)}
                    />
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      className="text-red-500 text-xs px-2 py-1 border border-red-500 rounded hover:bg-red-500 hover:text-white"
                      onClick={() => {
                        setPopupOpen(true);
                        setItemIndex(index);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {/* Editable extraItems */}
              {billData?.extraItems?.map((item, idx) => (
                <tr key={`extra-${idx}`} className="border bg-yellow-50">
                  <td className="border p-2">
                    <Input
                      type="text"
                      className="p-1"
                      value={item.itemName}
                      onChange={(e) => handleExtraItemChange(idx, "itemName", e.target.value)}
                    />
                  </td>
                  <td className="border p-2">
                    <Input
                      type="number"
                      className="p-1 text-right"
                      value={item.quantity}
                      onChange={(e) => handleExtraItemChange(idx, "quantity", e.target.value)}
                    />
                  </td>
                  <td className="border p-2">
                    <Input
                      type="number"
                      className="p-1 text-right"
                      value={item.salePrice}
                      onChange={(e) => handleExtraItemChange(idx, "salePrice", e.target.value)}
                    />
                  </td>
                  <td className="border p-2">—</td>
                  <td className="border p-2 text-center">
                    <button
                      className="text-red-500 text-xs px-2 py-1 border border-red-500 rounded hover:bg-red-500 hover:text-white"
                      onClick={() => handleDeleteExtra(idx)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4">
        <p>Total Amount: {calculateTotals().totalAmount}</p>
        <p>Total Discount: {calculateTotals().totalDiscount}</p>
        <p>Outstanding Amount: {calculateTotals().outstandingAmount}</p>
      </div>

      <div className="mt-4 flex justify-end text-xs gap-2">
        <Button className="p-1 px-2" onClick={() => setSavePopupOpen(true)}>
          Save Changes
        </Button>
        <Button className="p-1 px-2" onClick={() => setIsEditing(false)}>
          close
        </Button>
      </div>

      {/* Delete Extra Item Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteExtraConfirm}
        onConfirm={confirmDeleteExtra}
        onCancel={() => {
          setShowDeleteExtraConfirm(false);
          setExtraItemIndexToDelete(null);
        }}
        title="Delete Extra Item"
        message="Are you sure you want to delete this extra item?"
        type="delete"
        confirmText="Delete"
      />
    </div>
  );
};

export default UpdateBill;
