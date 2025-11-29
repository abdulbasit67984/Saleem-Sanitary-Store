

/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import config from "../../../features/config";
import {
  setSearchQuery,
  setSearchQueryProducts,
  setVendorProducts,
  setDate,
  setPaidAmount,
  setFlatDiscount,
  setDescription,
  setBillNo,
  clearPurchaseState,
  setTotalAmount,
  setVendor,
  setSelectedItems, // New: Set selected items in store
} from "../../../store/slices/purchase/purchaseItemSlice";
import { setAllProducts } from "../../../store/slices/products/productsSlice"
import Input from "../../Input";
import Button from "../../Button";
import Loader from "../../../pages/Loader";

const PurchaseItem = () => {
  const dispatch = useDispatch();
  const [isAddingNewProduct, setIsAddingNewProduct] = useState(false);
  const [error, setError] = useState("");
  const [addSalePrice, setAddSalePrice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productName: '',
    productCode: '',
    categoryId: '',
    typeId: '',
    companyId: '',
    productExpiryDate: '',
    salePrice1: 0,
    salePrice2: 0,
    salePrice3: 0,
    salePrice4: 0,
    vendorSupplierId: '',
    vendorCompanyId: '',
    productDiscountPercentage: '',
    productPack: 1,
    packUnit: 'pcs',
    productPurchasePrice: '',
    productTotalQuantity: 0,
    quantityUnit: 'pcs',
    isNewProduct: true,
  });

  const {
    billNo,
    date,
    description,
    billType,
    billPaymentType,
    vendorData,
    searchQuery,
    searchQueryProducts,
    selectedItems,
    totalAmount,
    flatDiscount,
    paidAmount,
    previousBalance,
    isPaid,
    vendor,
    vendorProducts,
  } = useSelector((state) => state.purchaseItem);


  const { allProducts } = useSelector((state) => state.saleItems);
  const companyData = useSelector((state) => state.companies.companyData);
  const supplierData = useSelector((state) => state.suppliers.supplierData);
  const categoryData = useSelector((state) => state.categories.categoryData);
  const typeData = useSelector((state) => state.types.typeData);

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const results = allProducts.filter(
        (product) =>
          (product.vendorCompanyDetails[0]?._id === vendor ||
            product.vendorSupplierDetails[0]?._id === vendor) &&
          (product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.productCode?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      dispatch(setSearchQueryProducts(results));
    } else {
      dispatch(setSearchQueryProducts([]));
    }
  }, [searchQuery, allProducts, dispatch, vendor]);

  const handleGenerateBill = async () => {
    if (!vendor || !selectedItems) {
      alert("Please fill all the required fields.");
      return;
    }

    const userConfirmed = window.confirm(
      "Are you sure you want to Generate the purchase invoice? This action cannot be undone."
    );

    if (userConfirmed) {
      setIsLoading(true)
      try {
        const billItems = selectedItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          discount: item.discount,
          pricePerUnit: item.pricePerUnit,
          productPack: item.productPack,
        }))
        console.log("billItems", billItems)

        const isVendorCompany = companyData.find((company) => company._id === vendor);
        const isVendorSupplier = supplierData.find((supplier) => supplier._id === vendor);

        const response = await config.createPurchase({
          billNo,
          vendorSupplierId: isVendorSupplier ? vendor : null,
          vendorCompanyId: isVendorCompany ? vendor : null,
          purchaseItems: billItems,
          flatDiscount: flatDiscount || 0,
          purchaseDate: date,
          paidAmount,
        });

        if (response && response.data) {
          console.log("response: ", response.data);
          dispatch(clearPurchaseState())
        }

        // setIsInvoiceGenerated(true);

      } catch (error) {
        const htmlString = error.response?.data;

        // Parse the HTML string into a DOM object
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');

        const preContent = doc.querySelector('pre').innerHTML.replace(/<br\s*\/?>/gi, '\n');

        // Extract only the first line (the error message)
        const errorMessage = preContent.split('\n')[0]; // Get the first line

        setError(errorMessage)
      } finally {
        setIsLoading(false)

      }
    }
  };

  // Add product from search results to invoice table
  const handleAddProduct = (product) => {
    const existingItem = selectedItems.find((item) => item.productId === product._id);

    if (existingItem) {
      setError("Product already added!");
      return;
    }

    const transformedProduct = {
      productId: product._id,
      productName: product.productName,
      quantity: 1,
      pricePerUnit: product.productPurchasePrice || 0,
      discount: 0,
      productPack: product.productPack || 1, // Use productPack from the response
    };

    dispatch(
      setSelectedItems([
        ...selectedItems,
        transformedProduct
      ])
    );

    const items = [...selectedItems, transformedProduct];

    // Recalculate totals
    // console.log(items)
    const totals = calculateTotals(items);

    dispatch(setTotalAmount(totals.totalAmount));

    dispatch(setSearchQuery(''))
    setError('')
  };

  const handleAddNewProduct = async () => {
    if (!newProduct.productName || !newProduct.productPurchasePrice || !newProduct.salePrice1) {
      setError("Required fields missing!");
      return;
    } else if (!vendor) {
      setError("Please select a vendor!");
      return;
    }

    setIsLoading(true);
    setError("");

    // Check if the vendor is a company or supplier
    const isVendorCompany = companyData.find((company) => company._id === vendor);
    const isVendorSupplier = supplierData.find((supplier) => supplier._id === vendor);

    if (isVendorCompany) {
      newProduct.vendorCompanyId = vendor;
    } else if (isVendorSupplier) {
      newProduct.vendorSupplierId = vendor;
    }

    try {
      const cleanedData = Object.fromEntries(
        Object.entries(newProduct).filter(([_, value]) => value !== "")
      );

      const response = await config.registerStock(cleanedData);

      if (response && response.data) {
        const registeredProduct = response.data.createdProduct;
        console.log("Product registered: ", registeredProduct);

        const transformedProduct = {
          _id: registeredProduct._id,
          productId: registeredProduct._id,
          productName: registeredProduct.productName,
          quantity: 0,
          pricePerUnit: registeredProduct.productPurchasePrice || 0,
          discount: 0,
          productPack: registeredProduct.productPack || 1, // Use productPack from the response
        };
        console.log("transformed product", transformedProduct);

        // Add the transformed product to selectedItems
        dispatch(setSelectedItems([...selectedItems, transformedProduct]));

        // Fetch all products again to update the list
        const products = await config.fetchAllProducts();
        if (products && products.data) {
          dispatch(setAllProducts(products.data));
        }

        // Reset the new product form
        setNewProduct({
          productCode: '',
          productName: '',
          categoryId: '',
          typeId: '',
          companyId: '',
          productExpiryDate: '',
          salePrice1: 0,
          salePrice2: 0,
          salePrice3: 0,
          salePrice4: 0,
          vendorSupplierId: '',
          vendorCompanyId: '',
          productDiscountPercentage: '',
          productPack: 1,
          productPurchasePrice: '',
          productTotalQuantity: 0,
          isNewProduct: true,
        });

        setIsAddingNewProduct(false); // Hide new product form
      }
    } catch (error) {
      setError("Failed to add product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewProductChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, key, value) => {
    const updatedItems = selectedItems.map((item, i) =>
      i === index ? { ...item, [key]: value } : item
    );

    // Recalculate totals
    const totals = calculateTotals(updatedItems);

    // Update selectedItems and totals in the state
    dispatch(setSelectedItems(updatedItems));
    dispatch(setTotalAmount(totals.totalAmount));
  };

  const handleDeleteItem = (index) => {
    const updatedItems = selectedItems.filter((_, i) => i !== index);
    const totals = calculateTotals(updatedItems);
    dispatch(setSelectedItems(updatedItems));
    dispatch(setTotalAmount(totals.totalAmount));
  };

  const calculateTotals = (items) => {
    let totalAmount = 0;
    let totalDiscount = 0;

    items.forEach((item) => {
      const itemTotal = item.quantity * item.pricePerUnit;
      const itemDiscount = (itemTotal * item.discount) / 100;

      totalAmount += itemTotal;
      totalDiscount += itemDiscount;
    });

    const netTotal = totalAmount;
    const billBalance = netTotal - paidAmount - totalDiscount;

    return {
      totalAmount: netTotal.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      billBalance: billBalance.toFixed(2),
    };
  };

  return (
    <div className="p-4 bg-white shadow-md rounded">
      {/* Invoice Information */}
      <div className="mb-2 grid grid-cols-4 gap-2 text-xs">
        <label className="ml-1 flex items-center">
          <span className="w-28">Vendor Name:</span>
          <select
            className="border p-1 rounded text-xs w-44"
            onChange={(e) => dispatch(setVendor(e.target.value))}
            value={vendor || ""}
          >
            <option value="">Select Vendor company</option>
            {companyData?.map((vendor, index) => (
              <option key={index} value={vendor._id}>
                {vendor.companyName}
              </option>
            ))}
            <option value="">Select Vendor Supplier</option>
            {supplierData?.map((vendor, index) => (
              <option key={index} value={vendor._id}>
                {vendor.supplierName}
              </option>
            ))}
          </select>
        </label>

        <Input
          label="Bill No:"
          placeholder="Enter Bill No"
          value={billNo || ""}
          onChange={(e) => dispatch(setBillNo(e.target.value))}
          divClass="flex gap-2 text-xs items-center"
          className="p-1"

        />
        <Input
          label="Date:"
          type="date"
          value={date || ''}
          onChange={(e) => dispatch(setDate(e.target.value))}
          divClass="flex gap-2 text-xs items-center"
          className="p-1"
        />
        <Input
          label="Description:"
          placeholder="Enter Description"
          value={description || ''}
          onChange={(e) => dispatch(setDescription(e.target.value))}
          divClass="flex gap-2 text-xs items-center"
          className="p-1"
        />

      </div>

      <div className="border-b my-3"></div>

      {/* Product Search or Add New */}
      <div className="mb-2">
        <div className="">

          <div className='flex items-center w-full'>

            <label className="flex items-center gap-2">
              <input type="checkbox" checked={isAddingNewProduct} onChange={() => setIsAddingNewProduct(!isAddingNewProduct)} />
              <span className="text-xs w-24">Add New Product</span>
            </label>

            {error && <p className={`text-red-500 font-thin w-full text-sm px-4 text-center`}>{error ? error : 'Invoice generated successfully!'}</p>}
            <div className="flex w-full justify-end">
              <Button className='p-1 px-4 text-xs ' onClick={() => {
                const res = window.confirm('Are you sure you want to clear the invoice')
                if (res) {
                  dispatch(clearPurchaseState())
                }
              }}>Clear Bill</Button>
            </div>
          </div>

          {!isAddingNewProduct ? (
            // Existing Product Search
            <div className="flex gap-2 text-xs mt-2">
              <Input
                label="Search:"
                placeholder="Search by Name / Code"
                value={searchQuery || ""}
                onChange={(e) => {
                  const value = e.target.value;

                  if (!vendor) {
                    setError("Please select a vendor!");
                  } else if (!value.length === 0 && allProducts.length === 0) {
                    setError("No products found for this vendor!");
                    dispatch(setSearchQuery(value));
                  } else {
                    setError("");
                    dispatch(setSearchQuery(value));
                  }
                }}
                divClass="flex gap-2 text-xs items-center"
                className="p-1"
                ref={inputRef}
              />

              <Button
                onClick={() => { handleGenerateBill() }}
                className='p-1 px-4'
              >Add</Button>
            </div>
          ) : (
            // New Product Fields
            <div className="grid grid-cols-3 gap-2 text-xs mt-2">
              <Input
                label="Product Code:"
                placeholder="Enter Product Code"
                name="productCode"
                value={newProduct.productCode}
                onChange={handleNewProductChange}
                labelClass="w-28"
                divClass="flex gap-2 text-xs items-center"
                className="p-1"
                ref={inputRef}
              />
              <Input
                label="Product Name: (Required)"
                placeholder="Enter Product Name"
                name="productName"
                value={newProduct.productName}
                onChange={handleNewProductChange}
                labelClass="w-28"
                divClass="flex gap-2 text-xs items-center"
                className="p-1"
                ref={inputRef}
              />

              <div className="flex items-center">
                <label className="w-28" htmlFor="companyId">Select Category:</label>
                <select
                  className={`border p-1 text-xs rounded w-44`}
                  name="categoryId"
                  value={newProduct.categoryId}
                  onChange={handleNewProductChange}
                >
                  <option value="">Select Category</option>
                  {categoryData && categoryData.map((category, index) => (
                    <option key={index} value={category._id}>{category.categoryName}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <label className="w-28" htmlFor="companyId">Select Type:</label>
                <select
                  className={`border p-1 text-xs rounded w-44`}
                  name="typeId"
                  value={newProduct.typeId}
                  onChange={handleNewProductChange}
                >
                  <option value="">Select Type</option>
                  {typeData && typeData.map((type, index) => (
                    <option key={index} value={type._id}>{type.typeName}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <label className="w-28" htmlFor="companyId">Select Company:</label>
                <select
                  className={`border p-1 text-xs rounded w-44`}
                  name="companyId"
                  value={newProduct.companyId}
                  onChange={handleNewProductChange}
                >
                  <option value="">Select Company</option>
                  {companyData && companyData.map((company, index) => (
                    <option key={index} value={company._id}>{company.companyName}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Expiry Date:"
                name="productExpiryDate"
                type="date"
                value={newProduct.productExpiryDate}
                onChange={handleNewProductChange}
                labelClass="w-28"
                divClass="flex gap-2 text-xs items-center"
                className="p-1"
              />

              <Input
                label="Discount %:"
                name="productDiscountPercentage"
                value={newProduct.productDiscountPercentage}
                onChange={handleNewProductChange}
                labelClass="w-28"
                divClass="flex gap-2 text-xs items-center"
                className="p-1"
              />
              <div className='flex gap-2'>
                <div className="flex gap-10 items-center">
                  <label htmlFor="">Pack: </label>
                  <input
                    type="text"
                    name="productPack"
                    value={newProduct.productPack}
                    onChange={handleNewProductChange}
                    className="border p-1 rounded-md w-20"
                  />
                </div>
                <select
                  name="packUnit"
                  className='px-2 rounded-lg text-[11px]'
                  // value={newProduct.packUnit}
                  onChange={handleNewProductChange}
                >
                  <option value="">Select Pack Unit</option>
                  {['pcs', 'kg', 'grams', 'ft', 'inches', 'cm'].map((unit, i) => (
                    <option key={i} value={unit}>{unit.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div className='flex gap-2'>
                <div className="flex gap-10 items-center">
                  <label htmlFor="">Total Qty: </label>
                  <input
                    type="text"
                    value={0}
                    disabled
                    className="border p-1 rounded-md w-20"
                  />
                </div>
                <select
                  name="quantityUnit"
                  className='px-2 rounded-lg text-[11px]'
                  // value={newProduct.quantityUnit}
                  onChange={handleNewProductChange}
                >
                  <option value="">Select Quantity Unit</option>
                  {['pcs', 'cotton', 'box', 'pack', 'kg', 'ton','meter', 'yard','ft'].map((unit, i) => (
                    <option key={i} value={unit}>{unit.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Purchase Price: *"
                name="productPurchasePrice"
                value={newProduct.productPurchasePrice}
                onChange={handleNewProductChange}
                labelClass="w-28"
                divClass="flex gap-2 text-xs items-center"
                className="p-1"
              />
              {/* <Input
                label="Total Quantity:"
                name="productTotalQuantity"
                value={newProduct.productTotalQuantity}
                onChange={handleNewProductChange}
                labelClass="w-28"
                divClass="flex gap-2 text-xs items-center"
                className="p-1"
              /> */}
              <Input
                label="Sale Price 1: (Required)"
                name="salePrice1"
                value={newProduct.salePrice1}
                onChange={handleNewProductChange}
                labelClass="w-28"
                divClass="flex gap-2 text-xs items-center"
                className="p-1"
              />
              {
                addSalePrice && (
                  <div>
                    <Input
                      label="Sale Price 2:"
                      name="salePrice2"
                      value={newProduct.salePrice2}
                      onChange={handleNewProductChange}
                      labelClass="w-28"
                      divClass="flex gap-2 text-xs items-center"
                      className="p-1"
                    />
                  </div>
                )}
              {
                addSalePrice && (
                  <div>
                    <Input
                      label="Sale Price 3:"
                      name="salePrice3"
                      value={newProduct.salePrice3}
                      onChange={handleNewProductChange}
                      labelClass="w-28"
                      divClass="flex gap-2 text-xs items-center"
                      className="p-1"
                    />
                  </div>
                )}
              {
                addSalePrice && (
                  <div>
                    <Input
                      label="Sale Price 4:"
                      name="salePrice4"
                      value={newProduct.salePrice4}
                      onChange={handleNewProductChange}
                      labelClass="w-28"
                      divClass="flex gap-2 text-xs items-center"
                      className="p-1"
                    />
                  </div>
                )}


              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="text-xs"
                  id="addSalePrice"
                  checked={addSalePrice == true}
                  onChange={() => setAddSalePrice((prev) => !prev)}
                />
                <label htmlFor="addSalePrice">Add Other Sale Prices</label>
              </div>

              <Button
                onClick={handleAddNewProduct}
                className='p-1 px-4'
              >Add New Product</Button>
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="overflow-auto max-h-72 bg-white absolute w-[81%] shadow-md z-10">
            <table className="min-w-full border text-xs">
              <thead>
                <tr>
                  <th className="text-left px-2 py-1">#</th>
                  <th className="text-left px-2 py-1">Name</th>
                  <th className="text-left px-2 py-1">Pack</th>
                  <th className="text-left px-2 py-1">Sale Price</th>
                  <th className="text-left px-2 py-1">Total QTY</th>
                </tr>
              </thead>
              <tbody>
                {searchQueryProducts.length ? (
                  searchQueryProducts.map((product, index) => (
                    <tr
                      key={index}
                      className="cursor-pointer hover:bg-gray-300"
                      onClick={() => handleAddProduct(product)}
                    >
                      <td className="px-2 py-1">{index + 1}</td>
                      <td className="px-2 py-1">{product.productName}</td>
                      <td className="px-2 py-1">{product.productPack}</td>
                      <td className="px-2 py-1">{product.salePriceDetails[0]?.salePrice1}</td>
                      <td className="px-2 py-1">{product.productTotalQuantity}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-gray-500 py-2">
                      No products found for this vendor!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Table */}
      <div className="overflow-auto max-h-60 scrollbar-thin">
        <table className="min-w-full bg-white border text-xs">
          <thead className="bg-gray-300">
            <tr>
              <th className="py-2 px-1 text-left">S No</th>
              <th className="py-2 px-1 text-left">Name</th>
              <th className="py-2 px-1 text-left">Qty</th>
              <th className="py-2 px-1 text-left">Rate</th>
              <th className="py-2 px-1 text-left">Discount %</th>
              <th className="py-2 px-1 text-left">Net</th>
              <th className="py-2 px-1 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {selectedItems.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 px-1 text-left">{index + 1}</td>
                <td className="py-2 px-1 text-left">{item.productName}</td>
                <td className="py-2 px-1 text-left">
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value))}
                    className="text-right p-1"
                  />
                </td>
                <td className="py-2 px-1 text-left">
                  <Input
                    type="number"
                    value={item.pricePerUnit}
                    onChange={(e) => handleItemChange(index, "pricePerUnit", parseFloat(e.target.value))}
                    className="text-right p-1"

                  />
                </td>
                <td className="py-2 px-1 text-left">
                  <Input
                    type="number"
                    value={item.discount}
                    onChange={(e) => handleItemChange(index, "discount", parseFloat(e.target.value))}
                    className="text-right p-1"

                  />
                </td>
                <td className="py-2 px-1 text-left">{(item.quantity * item.pricePerUnit).toFixed(2)}</td>
                <td className="py-2 px-1 text-left">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-lg"
                    onClick={() => handleDeleteItem(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="mt-4 border-t p-2 text-sm">
          <Input label="Total Amount:" labelClass="w-24 text-sm" className="p-1" value={totalAmount || 0} readOnly />
          <Input label="Total Discount:" labelClass="w-24 text-sm" className="p-1" value={flatDiscount || 0} onChange={(e) => dispatch(setFlatDiscount(e.target.value))} />
          <Input label="Paid Amount:" labelClass="w-24 text-sm" className="p-1" value={paidAmount || 0} onChange={(e) => dispatch(setPaidAmount(e.target.value))} />
          <Input label="Bill Balance:" labelClass="w-24 text-sm" className="p-1" value={totalAmount - paidAmount - flatDiscount || 0} readOnly />
        </div>
      </div>
    </div>
  );
};

export default PurchaseItem;
