/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setSelectedItems,
  setReturnType,
  setCustomer,
  setTotalReturnAmount,
  setFlatDiscount,
  setReturnReason,
  resetSaleReturn,
  setLoading,
} from '../../../store/slices/sales/saleReturnSlice';
import Input from '../../Input';
import Button from '../../Button';
import config from '../../../features/config'; // Import your config file

const DirectSaleReturn = () => {
  const dispatch = useDispatch();
  const { selectedItems, customer, totalReturnAmount, flatDiscount, returnReason } = useSelector(
    (state) => state.saleReturn
  );
  const customerData = useSelector((state) => state.customers.customerData);
  const { allProducts } = useSelector((state) => state.saleItems);

  const [productSearch, setProductSearch] = useState('');
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (productSearch) {
      const results = allProducts.filter(
        (product) =>
          product.productName.toLowerCase().includes(productSearch.toLowerCase()) ||
          product.productCode?.toLowerCase().includes(productSearch.toLowerCase())
      );
      setFilteredProducts(results);
    } else {
      setFilteredProducts([]);
    }
  }, [productSearch, allProducts]);



  const handleAddProduct = () => {
    if (product) {
      console.log(product);

      const newItem = {
        ...product,
        quantity,
        returnPrice: product.salePriceDetails[0]?.salePrice1 || 0,
        billItemUnit: 0,
      };
      dispatch(setSelectedItems([...selectedItems, newItem]));
      console.log(selectedItems);
      setProduct(null);
      setQuantity(1);
      setProductSearch('');
    }
  };

  const handleQuantityChange = (index, newQuantity) => {
    const updatedItems = selectedItems.map((item, i) =>
      i === index ? { ...item, quantity: newQuantity } : item
    );
    dispatch(setSelectedItems(updatedItems));
  };

  const handleItemUnitsChange = (index, newUnits) => {
      const item = selectedItems[index];
      if (!item) return;
  
      // sanitize
      if (isNaN(newUnits)) newUnits = 0;
      // console.log('item', item)
  
      if (newUnits > item?.maxUnits) {
        // set to max and show error
        const updatedItems = selectedItems.map((it, i) =>
          i === index ? { ...it, billItemUnit: item.maxUnits } : it
        );
        dispatch(setSelectedItems(updatedItems));
  

        return;
      }
  
      const updatedItems = selectedItems.map((it, i) =>
        i === index ? { ...it, billItemUnit: newUnits } : it
      );
      dispatch(setSelectedItems(updatedItems));
    };

  const handlePriceChange = (index, newPrice) => {
    const updatedItems = selectedItems.map((item, i) =>
      i === index ? { ...item, returnPrice: newPrice } : item
    );
    dispatch(setSelectedItems(updatedItems));  
  };

  const handleCalculateTotal = () => {
    const total = selectedItems.reduce((sum, item) => sum + item.returnPrice * (item.billItemUnit / item.productPack + item.quantity), 0);
    dispatch(setTotalReturnAmount(total));
  };

  const handleDelete = (index) => {
    const updatedItems = [...selectedItems];
        updatedItems.splice(index, 1);
        dispatch(setSelectedItems(updatedItems));
  }

  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      alert("Please select add items for return.");
      return;
    }
    console.log('first', selectedItems)

    setIsLoading(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const returnItems = selectedItems.map((item) => ({
        productId: item._id, 
        quantity: parseInt( item.quantity),
        returnPrice: item.returnPrice,
        billItemUnit: item.billItemUnit

      }));
       console.log('returnItems', returnItems)
       
       const response = await config.createSaleReturn({
         customer,
         returnType: 'direct',
         returnItems,
         totalReturnAmount,
         flatDiscount: flatDiscount || 0,
         returnReason,
        });
        console.log('1', response)
        
      if (response) {
        setSubmitSuccess(true);
        dispatch(resetSaleReturn());
      }
    } catch (error) {
      // let errorMessage = "An error occurred.";
      if (error.response && error.response.data) {
        const htmlString = error.response.data;
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const preContent = doc.querySelector('pre')?.innerHTML.replace(/<br\s*\/?>/gi, '\n');
        // errorMessage = preContent?.split('\n')[0] || errorMessage;
        setSubmitError(preContent);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleCalculateTotal()
  }, [selectedItems])

  return (
    <div className="p-4 bg-white rounded shadow text-xs">
      <h2 className="text-lg font-semibold mb-4">Direct Sale Return</h2>

      <div className='flex justify-between'>
        <div>
          {/* Product Search */}
          <div className="mb-4 text-xs flex flex-col gap-2">
            <label className="ml-1 flex items-center">
              <span className="w-28">Customer Name:</span>
              <select onChange={(e) => dispatch(setCustomer(e.target.value))} className={` border p-1 rounded text-xs w-44`}>
                <option value=''>Select Customer</option>
                {customerData && customerData?.map((customer, index) => (
                  <option key={index} value={customer._id}>{customer.customerName}</option>
                ))}
              </select>
            </label>

            <Input
              label="Search Product"
              placeholder="Enter product name or code"
              labelClass="w-24"
              className='w-72 text-xs p-1'
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
            />
          </div>
          {/* search query products here */}
        </div>
        <div>
          {/* Actions */}
          <div className="flex gap-2 text-xs">
            <Button
              className='px-4'
              onClick={() => handleSubmit()}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Return'}
            </Button>
            <Button
              className='px-4'
              onClick={() => dispatch(resetSaleReturn())}
              variant="secondary"
              disabled={isLoading}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {productSearch && (
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
              {filteredProducts?.slice(0, 250).map((product, index) => (
                <tr
                  key={index}
                  className="cursor-pointer hover:bg-gray-300"
                  onClick={() => {
                    setProduct(product);
                    handleAddProduct();
                  }}
                >
                  <td className="px-2 py-1">{index + 1}</td>
                  <td className="px-2 py-1">{product.productName}</td>
                  <td className="px-2 py-1">{product.productPack}</td>
                  <td className="px-2 py-1">
                    {product.salePriceDetails[0]?.salePrice1}
                  </td>
                  <td className="px-2 py-1">{product.productTotalQuantity}</td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-2">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Selected Products */}
      <div className="mb-4 max-h-72 overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border text-left">Product</th>
              <th className="p-2 border text-left">Quantity</th>
              <th className="p-2 border text-left">Units</th>
              <th className="p-2 border text-left">Price/Pack</th>
              <th className="p-2 border text-left">Total</th>
              <th className="p-2 border text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {selectedItems.map((item, index) => (
              <tr key={index} className="border">
                <td className="p-2 text-left">{item.productName}</td>
                <td className="p-2 text-left">
                  <input type="number" value={item.quantity} className="border p-1 w-16" onChange={(e) => handleQuantityChange(index, e.target.value)} />
                </td>
                <td className="p-2 text-left">
                  <input type="number" value={item.billItemUnit} className="border p-1 w-16" onChange={(e) => handleItemUnitsChange(index, e.target.value)} />
                </td>
                <td className="p-2 text-left">
                <input type="number" value={item.returnPrice} className="border p-1 w-16" onChange={(e) => handlePriceChange(index, e.target.value)} />
                </td>
                <td className="p-2 text-left">{(item.returnPrice * (item.billItemUnit / item.productPack + item.quantity)).toFixed(2)}</td>
                <td className="p-2 text-left">
                  <Button onClick={handleDelete}>Remove</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='flex justify-between'>
        {/* Return Reason */}
        <div className="mb-4 text-xs">
          <Input
            label="Return Reason"
            placeholder="Enter reason for return"
            labelClass="w-24"
            className='w-72 text-xs p-1'
            value={returnReason}
            onChange={(e) => dispatch(setReturnReason(e.target.value))}
          />
        </div>
        {/* Totals */}
        <div className="mb-4 text-xs flex flex-col gap-2">
          <Input
            label="Total Return Amount"
            labelClass="w-32"
            className='w-48 text-xs p-1'
            value={Number(totalReturnAmount)?.toFixed(2)}
            readOnly
          />
        </div>
      </div>

      {submitError && <p className="text-red-500">{submitError}</p>}
      {submitSuccess && <p className="text-green-500">Sale return submitted successfully!</p>}
    </div>
  );
};

export default DirectSaleReturn;