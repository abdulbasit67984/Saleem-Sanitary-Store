/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */
// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from "react";
// import { useForm, useFieldArray } from "react-hook-form";
// import axios from "axios";
// import config from "../../../../features/config";

// const UpdateBill = ({ billId }) => {
//   const [billData, setBillData] = useState(null); // Holds existing bill data
//   const { register, control, handleSubmit, setValue } = useForm({
//     defaultValues: {
//       description: "",
//       billStatus: "",
//       paidAmount: "",
//       flatDiscount: "",
//       dueDate: "",
//       billItems: [], // Default empty array for items
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "billItems",
//   });

//   // Fetch existing bill data
//   useEffect(() => {
//     const fetchBill = async () => {
//       try {
//         const res = await config.fetchSingleBill(billId)
//         console.log(res.data)
//         setBillData(res.data);
//         const bill = res.data
//         if (bill) {
//           // Pre-fill form values
//           setValue("description", bill.description || "");
//           setValue("billStatus", bill.billStatus || "");
//           setValue("paidAmount", bill.paidAmount || "");
//           setValue("flatDiscount", bill.flatDiscount || "");
//           setValue("dueDate", bill.dueDate || "");
//           setValue("billItems", bill.billItems || []);
//         }
//       } catch (error) {
//         console.error("Failed to fetch bill:", error);
//       }
//     };
//     fetchBill();
//   }, [billId, setValue]);

//   // Submit handler
//   const onSubmit = async (data) => {
//     try {
//       const response = await axios.put(`/api/bills/${billId}`, data);
//       alert("Bill updated successfully!");
//     } catch (error) {
//       console.error("Error updating bill:", error);
//       alert("Failed to update bill.");
//     }
//   };

//   return (
//     <div className="p-4 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Update Bill</h1>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         {/* Description */}
//         <div>
//           <label className="block mb-1 font-medium">Description</label>
//           <input
//             {...register("description")}
//             type="text"
//             className="w-full border rounded p-2"
//           />
//         </div>

//         {/* Bill Status */}
//         <div>
//           <label className="block mb-1 font-medium">Bill Status</label>
//           <select {...register("billStatus")} className="w-full border rounded p-2">
//             <option value="">Select Status</option>
//             <option value="Paid">Paid</option>
//             <option value="Unpaid">Unpaid</option>
//             <option value="Partially Paid">Partially Paid</option>
//           </select>
//         </div>

//         {/* Paid Amount */}
//         <div>
//           <label className="block mb-1 font-medium">Paid Amount</label>
//           <input
//             {...register("paidAmount")}
//             type="number"
//             className="w-full border rounded p-2"
//           />
//         </div>

//         {/* Flat Discount */}
//         <div>
//           <label className="block mb-1 font-medium">Flat Discount</label>
//           <input
//             {...register("flatDiscount")}
//             type="number"
//             className="w-full border rounded p-2"
//           />
//         </div>

//         {/* Due Date */}
//         <div>
//           <label className="block mb-1 font-medium">Due Date</label>
//           <input
//             {...register("dueDate")}
//             type="date"
//             className="w-full border rounded p-2"
//           />
//         </div>

//         {/* Bill Items */}
//         <div>
//           <h2 className="text-lg font-semibold mb-2">Bill Items</h2>
//           {fields.map((item, index) => (
//             <div key={item.id} className="grid grid-cols-5 gap-2 mb-2">
//               {/* Item Name */}
//               <input
//                 // {...register(`billItems.${index}.itemName`)}
//                 placeholder="Item Name"
//                 value={item.productName}
//                 className="border rounded p-2 col-span-2"
//               />
//               {/* Quantity */}
//               <input
//                 {...register(`billItems.${index}.quantity`)}
//                 type="number"
//                 placeholder="Quantity"
//                 className="border rounded p-2"
//               />
//               {/* Rate */}
//               <input
//                 {...register(`billItems.${index}.rate`)}
//                 type="number"
//                 placeholder="Rate"
//                 className="border rounded p-2"
//               />
//               {/* Remove Button */}
//               <button
//                 type="button"
//                 onClick={() => remove(index)}
//                 className="text-red-500 font-semibold"
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={() => append({ itemName: "", quantity: 1, rate: 0 })}
//             className="text-blue-500 font-semibold"
//           >
//             Add Item
//           </button>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           Update Bill
//         </button>
//       </form>
//     </div>
//   );
// };

// export default UpdateBill;

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import config from "../../../../features/config";
import Input from "../../../Input";
import Button from "../../../Button";
import Loader from "../../../../pages/Loader";
import DeleteConfirmation from "../../../DeleteConfirmation";
import UpdateConfirmation from "../../../UpdateConfirmation";

const UpdateBill = ({ billId, setIsEditing }) => {
  const [billData, setBillData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isSavePopupOpen, setSavePopupOpen] = useState(false);
  const [itemIndex, setItemIndex] = useState(null)

  const customerData = useSelector((state) => state.customers.customerData)

  useEffect(() => {
    const fetchBill = async () => {
      try {
        setIsLoading(true);
        const response = await config.fetchSingleBill(billId);
        if (response && response.data) {
          console.log(response.data);
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
    const updatedItems = billData.billItems.map((item, i) =>
      i === index ? { ...item, [key]: value } : item
    );

    setBillData({ ...billData, billItems: updatedItems });
  };

  const calculateTotals = (items) => {
    let totalAmount = 0;
    let totalDiscount = 0;

    items.forEach((item) => {
      const itemTotal = item.quantity * item.billItemPrice;
      const itemDiscount = (itemTotal * item.billItemDiscount) / 100;

      totalAmount += itemTotal;
      totalDiscount += itemDiscount;
    });
    console.log(totalAmount);


    return {
      totalAmount: totalAmount.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      outstandingAmount: (totalAmount - billData.paidAmount - billData.flatDiscount).toFixed(2),
    };
  };

  const handleDeleteItem = (index) => {
    const updatedItems = billData.billItems.filter((_, i) => i !== index);
    setBillData({ ...billData, billItems: updatedItems });
    setPopupOpen(false);
  };


  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      const updatedBill = {
        ...billData,
        totalAmount: calculateTotals(billData.billItems).totalAmount,
      };
      console.log(updatedBill);

      await config.updateInvoice(updatedBill);
      alert("Bill updated successfully!");
    } catch (err) {
      setError("Failed to update the bill.");
    } finally {
      setIsLoading(false);
      setSavePopupOpen(false);
    }
  };

  if (isLoading) return <Loader message="Loading Bill Please Wait...." mt="" h_w="h-10 w-10 border-t-2 border-b-2" />;
  if (error) return <p className="text-red-500">{error}</p>;

  return isPopupOpen ?
    <DeleteConfirmation
      message="Are you sure you want to delete this item?"
      onConfirm={() => handleDeleteItem(itemIndex)}
      onCancel={() => setPopupOpen(false)}
      isOpen={isPopupOpen}
    />
    : (isSavePopupOpen ?
      <UpdateConfirmation
        message="Are you sure you want to update the bill?"
        onConfirm={() => handleSaveChanges()}
        onCancel={() => setSavePopupOpen(false)}
        isOpen={isSavePopupOpen}
      />
      : (
        <div className="px-4 py-2 bg-white shadow-md rounded">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold mb-1">Edit Bill</h2>
            <button className='hover:text-red-700 mb-1' onClick={() => setIsEditing(false)}>
              <span>&#10008;</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <Input
              className="p-1"
              label="Bill No:"
              labelClass="w-28"
              value={billData.billNo}
              readOnly
            />
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
                value={billData.customer || ""}
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
                          onChange={(e) => handleItemChange(index, "discount", e.target.value)}
                        />
                      </td>
                      <td className="border p-2 text-center">
                        <button
                          className="text-red-500 text-xs px-2 py-1 border border-red-500 rounded hover:bg-red-500 hover:text-white"
                          onClick={() => {
                            setPopupOpen(true)
                            setItemIndex(index)
                          }}
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
            <p>Total Amount: {calculateTotals(billData.billItems).totalAmount}</p>
            <p>Total Discount: {calculateTotals(billData.billItems).totalDiscount}</p>
            <p>Outstanding Amount: {calculateTotals(billData.billItems).outstandingAmount}</p>
          </div>

          <div className="mt-4 flex justify-end text-xs gap-2">
            <Button className="p-1 px-2" onClick={() => setSavePopupOpen(true)}>Save Changes</Button>
            <Button className="p-1 px-2" onClick={() => setIsEditing(false)}>close</Button>
          </div>
        </div>
      ))
};

export default UpdateBill;
