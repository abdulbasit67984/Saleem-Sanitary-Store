/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setSelectedItems,
  setReturnType,
  setCustomer,
  setBillId,
  setBill,
  setTotalReturnAmount,
  setFlatDiscount,
  setReturnReason,
  resetSaleReturn,
} from '../../../store/slices/sales/saleReturnSlice';
import Input from '../../Input';
import Button from '../../Button';
import config from '../../../features/config';

const SaleReturnAgainstBill = () => {
  const dispatch = useDispatch();
  const { selectedItems, billId, bill, customer, totalReturnAmount, flatDiscount, returnReason } = useSelector(
    (state) => state.saleReturn
  );

  const [productSearch, setProductSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (billId && billId.length >= 5) {
      fetchBill(billId);
    }
  }, [billId]);

  const fetchBill = async (billId) => {
    try {
      const response = await config.fetchSingleBill(billId);
      if (response && response.data) {
        dispatch(setBill(response.data));
        dispatch(setCustomer(response.data.customer));
        dispatch(setReturnType('againstBill'));
      }
    } catch (error) {
      console.error('Error fetching bill:', error);
    }
  };

  useEffect(() => {
    if (productSearch.trim() && bill?.billItems) {
      const filtered = bill.billItems.filter((item) =>
        item.productId?.productName?.toLowerCase().includes(productSearch.toLowerCase()) ||
        item.productId?.productCode?.toLowerCase().includes(productSearch.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [productSearch, bill]);

  const handleSelectProduct = (selectedProduct) => {
    setProduct(selectedProduct);
    setProductSearch(selectedProduct.productName);
    setFilteredProducts([]);
  };

  const handleAddProduct = () => {
    if (product) {
      const newItem = {
        ...product,
        quantity,
        returnPrice: product.billItemPrice || 0,
      };
      dispatch(setSelectedItems([...selectedItems, newItem]));
      setProduct(null);
      setQuantity(1);
      setProductSearch('');
      console.log('selectedItems', selectedItems)
    }
  };

  const handleQuantityChange = (index, newQuantity) => {
    const updatedItems = selectedItems.map((item, i) =>
      i === index ? { ...item, quantity: newQuantity } : item
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
    const total = selectedItems.reduce((sum, item) => sum + item.returnPrice * item.quantity, 0);
    dispatch(setTotalReturnAmount(total - flatDiscount));
  };

  useEffect(() => {
    handleCalculateTotal();
  }, [selectedItems, flatDiscount]);

  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      alert("Please select add items for return.");
      return;
    }

    setIsLoading(true);
    setSubmitError('');
    setSubmitSuccess(false);
    
    // console.log( bill.customer?._id,
    //   billId,
    //   'againstBill',
    //   // returnItems,
    //   totalReturnAmount,
    //   returnReason,)
    try {
      const returnItems = selectedItems.map((item) => ({
        productId: item.productId._id, // Assuming your product has an _id
        quantity: item.quantity,
        returnPrice: item.returnPrice,

      }));


      const response = await config.createSaleReturn({
        customer: bill.customer?._id,
        billId,
        returnType: 'againstBill',
        returnItems,
        totalReturnAmount,
        returnReason,
      });

      if (response) {
        setSubmitSuccess(true);
        dispatch(resetSaleReturn());
      }
    } catch (error) {
      let errorMessage = "An error occurred.";
      if (error.response && error.response.data) {
        const htmlString = error.response.data;
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const preContent = doc.querySelector('pre')?.innerHTML.replace(/<br\s*\/?>/gi, '\n');
        errorMessage = preContent?.split('\n')[0] || errorMessage;
      }
      setSubmitError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg w-full font-semibold mb-4">Sale Return Against Bill: #{bill ? <span className="font-light">{bill.billNo}</span> : <span className="font-light">No bill found!!</span>}</h2>

      <div className="flex justify-between">
        <div>
          {/* Bill ID */}
          <div className="mb-2 text-xs">
            <Input
              label="Bill ID"
              labelClass="w-24"
              placeholder="Enter Bill ID"
              className="w-72 text-xs p-1"
              value={billId && billId || ''}
              disabled={bill}
              onChange={(e) => dispatch(setBillId(e.target.value))}
            />
          </div>

          {/* Product Search */}
          <div className="mb-4 text-xs relative">
            <Input
              label="Search Product"
              placeholder="Enter product name or code"
              labelClass="w-24"
              className="w-72 text-xs p-1"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
            />



          </div>
        </div>

        <div>
          {/* Actions */}
          <div className="flex gap-2 text-xs">
            <Button className="px-4" onClick={handleSubmit}>
              Submit Return
            </Button>
            <Button className="px-4" onClick={() => dispatch(resetSaleReturn())} variant="secondary">
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Display search results */}
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
                  <td className="px-2 py-1">{product.productId.productName}</td>
                  <td className="px-2 py-1">{product.productId.productPack}</td>
                  <td className="px-2 py-1">
                    {product.billItemPrice}
                  </td>
                  <td className="px-2 py-1">{product.quantity}</td>
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
      <div className="mb-4 max-h-72 overflow-y-auto scrollbar-thin">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border text-left">Product</th>
              <th className="p-2 border text-left">Quantity</th>
              <th className="p-2 border text-left">Price</th>
              <th className="p-2 border text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {selectedItems.map((item, index) => (
              <tr key={index} className="border">
                <td className="p-2 text-left">{item.productId.productName}</td>
                <td className="p-2 text-left">
                  <input
                    type="number"
                    value={item.quantity}
                    className="border p-1 w-16"
                    onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                  />
                </td>
                <td className="p-2 text-left">
                  <input
                    type="number"
                    value={item.returnPrice}
                    className="border p-1 w-16"
                    onChange={(e) => handlePriceChange(index, Number(e.target.value))}
                  />
                </td>
                <td className="p-2 text-left">{(item.returnPrice * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between">
        {/* Return Reason */}
        <div className="mb-4 text-xs">
          <Input
            label="Return Reason"
            placeholder="Enter reason for return"
            labelClass="w-24"
            className="w-72 text-xs p-1"
            value={returnReason}
            onChange={(e) => dispatch(setReturnReason(e.target.value))}
          />
        </div>
        <div className="mb-4 text-xs flex flex-col gap-2">
          <Input
            label="Total Return Amount"
            labelClass="w-32"
            className='w-48 text-xs p-1'
            value={totalReturnAmount}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default SaleReturnAgainstBill;
