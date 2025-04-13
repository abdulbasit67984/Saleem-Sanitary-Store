/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setSearchQuery,
  setSearchQueryProducts,
  setSelectedItems,
  setDate,
  setTotalQty,
  setFlatDiscount,
  setTotalGst,
  setTotalAmount,
  setPaidAmount,
  setPreviousBalance,
  setIsPaid,
  setProductName,
  setProductCode,
  setProductQuantity,
  setProductDiscount,
  setProductPrice,
  setProduct,
  setTotalGrossAmount,
  setProductUnits,
  setCustomer
} from '../../../store/slices/products/productsSlice'
import { setBillData } from '../../../store/slices/bills/billSlice';
import Input from '../../Input';
import Button from '../../Button';
import config from '../../../features/config';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../pages/Loader';
import { useForm } from 'react-hook-form';


const InvoiceComponent = () => {

  const navigate = useNavigate();


  const [quantityError, setQuantityError] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [productUnitError, setProductUnitError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [billNo, setBillNo] = useState(0)
  const [description, setDescription] = useState('')
  const [billType, setBillType] = useState('thermal')
  const [billPaymentType, setBillPaymentType] = useState('cash')
  const [customerIndex, setCustomerIndex] = useState('')
  const [customerFlag, setCustomerFlag] = useState('red')
  const [salesPerson, salesPalesPerson] = useState('')
  const [isInvoiceGenerated, setIsInvoiceGenerated] = useState(false);
  const [billError, setBillError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  const thermalColor = {
    th100: "bg-blue-100",
    th200: "bg-blue-200",
    th300: "bg-blue-300",
    th500: "bg-blue-500"
  }

  const A4Color = {
    a4100: "bg-gray-100",
    a4200: "bg-gray-200",
    a4300: "bg-gray-300",
    a4500: "bg-gray-500",
  }

  //bill states

  const customerData = useSelector((state) => state.customers.customerData)
  // console.log(customerData)
  const { primaryPath } = useSelector((state) => state.auth)


  // console.log("customer in invoice: ", customerData);

  const dispatch = useDispatch();
  const {
    allProducts,
    searchQuery,
    searchQueryProducts,
    selectedItems,
    date,
    totalQty,
    flatDiscount,
    totalGst,
    customerId,
    totalAmount,
    paidAmount,
    previousBalance,
    isPaid,
    productName,
    productUnits,
    productCode,
    productQuantity,
    productDiscount,
    productPrice,
    product,
    totalGrossAmount
  } = useSelector((state) => state.saleItems);

  const billData = useSelector(state => state.bills.billData)

  const handleSelectProduct = (product) => {
    dispatch(setSearchQuery(''));
    dispatch(setProductName(product.productName));
    dispatch(setProductCode(product.productCode));
    dispatch(setProductQuantity(1));
    dispatch(setProductDiscount(0));
    dispatch(setProductUnits(product.productPack));
    {
      customerFlag === "red" ? (
        dispatch(setProductPrice(product.salePriceDetails[0].salePrice1))
      ) : customerFlag === "green" ? (
        dispatch(setProductPrice(product.salePriceDetails[0].salePrice2))
      ) : customerFlag === "yellow" ? (
        dispatch(setProductPrice(product.salePriceDetails[0].salePrice3))
      ) : customerFlag === "white" ? (
        dispatch(setProductPrice(product.salePriceDetails[0].salePrice4))
      ) : (
      dispatch(setProductPrice(product.salePriceDetails[0].salePrice1))
    )
    }
    dispatch(setProduct(product));
  };

  const handleItemChange = (index, key, value) => {
    const updatedItems = selectedItems.map((item, i) =>
      i === index ? { ...item, [key]: value } : item
    );

    // Recalculate totals
    updateTotals();

    // Update selectedItems and totals in the state
    dispatch(setSelectedItems(updatedItems));
  };

  const handleAddProduct = () => {
    if (productName !== '') {
      // Check if the product is already in selectedItems
      const existingProductIndex = selectedItems.findIndex(
        (item) => item._id === product._id
      );

      if (existingProductIndex >= 0) {
        // If the product exists, update its quantity
        const updatedItems = selectedItems.map((item, index) => {
          if (index === existingProductIndex) {
            return {
              ...item,
              quantity: parseFloat(item.quantity) + parseFloat(productQuantity),
            };
          }
          return item;
        });

        dispatch(setSelectedItems(updatedItems));
      } else {
        // If the product does not exist, add it as a new product
        const newProduct = {
          ...product,
          salePrice1: productPrice,
          quantity: productQuantity,
          discount: productDiscount,
          billItemUnit: productUnits
        };

        console.log('updatedItems', selectedItems)
        dispatch(setSelectedItems([...selectedItems, newProduct]));
      }

      // Clear product details after adding
      dispatch(setSearchQueryProducts([]));
      dispatch(setProductName(''));
      dispatch(setProductCode(''));
      dispatch(setProductQuantity(1));
      dispatch(setProductDiscount(0));
      dispatch(setProductPrice(0));
      dispatch(setProductUnits(0));
      dispatch(setProduct({}));
      setPriceError('');
    }
  };



  const handleQuantityChange = (e) => {
    const value = (e.target.value);
    if (Number(value) || value.length == 0) {
      dispatch(setProductQuantity(value));
      setQuantityError('');
    } else {
      setQuantityError('Quantity must be a number.');
    }
  };

  const handleDiscountChange = (e) => {
    const value = (e.target.value);
    if (Number(value) || value.length == 0) {
      setDiscountError('');
      dispatch(setProductDiscount(value));
    } else {
      setDiscountError('Discount must be a number.');
    }
  };

  const handleProductUnitsChange = (e) => {
    const value = (e.target.value);
    if (Number(value) || value.length == 0) {
      setProductUnitError('');
      dispatch(setProductUnits(value));
      dispatch(setProductPrice((Number(productPrice) * Number(value)) / product.productPack));
    } else {
      setProductUnitError('Product Unit must be a number.');
    }
  };

  const handlePriceChange = (e) => {
    const value = (e.target.value);
    // console.log(typeof (value))
    if (Number(value) || value.length == 0) {
      setPriceError('');

      if (value < product.productPurchasePrice && value) {
        setPriceError(`minimum price is ${product.productPurchasePrice}`);
      }

      dispatch(setProductPrice(value));
    } else {
      setPriceError('Price must be a number.');
    }
  };

  const handleExtraDiscountChange = (index, extraDiscount) => {
    const updatedItems = [...selectedItems];
    updatedItems[index].extraDiscount = parseFloat(extraDiscount) || 0;
    dispatch(setSelectedItems(updatedItems))
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...selectedItems];
    updatedItems.splice(index, 1);
    dispatch(setSelectedItems(updatedItems));
    updateTotals();
  }

  const updateTotals = () => {
    const totalQty = selectedItems.reduce((sum, item) => sum + Number((item.quantity || 0)), 0);
    const totalDiscount = selectedItems.reduce((sum, item) => sum + (item.salePrice1 * item.quantity * (item.discount || 0) / 100), 0);
    const totalGrossAmount = selectedItems.reduce((sum, item) => sum + ((item.salePrice1 / item.productPack * item.billItemUnit * item.quantity)), 0);
    const totalAmount = Math.floor(totalGrossAmount - totalDiscount);
    const totalGst = 0
    // totalAmount * 0.18; // Assuming a GST rate of 18%
    const netAmount = totalAmount - totalDiscount + totalGst;
    const balance = (totalAmount - flatDiscount + totalGst - paidAmount);

    dispatch(setTotalGrossAmount(totalGrossAmount))
    dispatch(setTotalQty(totalQty))
    // dispatch(setFlatDiscount(totalDiscount));
    dispatch(setTotalAmount(totalAmount));
    dispatch(setTotalGst(totalGst));
    dispatch(setIsPaid((totalAmount - flatDiscount - paidAmount === 0) ? 'paid' : 'unpaid'));
  };


  const generateInvoice = async () => {

    if (!billType || !billPaymentType || !totalAmount) {
      alert("Please fill all the required fields.");
      return;
    }

    const userConfirmed = window.confirm(
      "Are you sure you want to Generate the invoice? This action cannot be undone."
    );

    if (userConfirmed) {
      setIsLoading(true)
      console.log(selectedItems)
      try {
        const billItems = selectedItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          billItemDiscount: item.discount,
          billItemPrice: item.salePrice1,
          billItemPack: item.productPack,
          billItemUnit: item.billItemUnit,
        }))

        const response = await config.createInvoice({
          description,
          billType,
          billPaymentType,
          customer: customerId,
          billItems,
          flatDiscount: flatDiscount || 0,
          billStatus: isPaid,
          totalAmount: totalAmount || 0,
          paidAmount: paidAmount || 0,
          dueDate
        });

        if (response) {
          console.log("response: ", response);
          dispatch(setSelectedItems([]))
          dispatch(setFlatDiscount(0))
          dispatch(setTotalQty(0))
          dispatch(setTotalAmount(0))
          dispatch(setTotalGrossAmount(0))
          dispatch(setPaidAmount(''))
          dispatch(setPreviousBalance(0))
          dispatch(setProductName(''))
          dispatch(setProductQuantity(''))
          dispatch(setProductDiscount(''))
          dispatch(setProductPrice(''))
          dispatch(setProduct({}))
          dispatch(setCustomer(null));
        }

        setIsInvoiceGenerated(true);

      } catch (error) {
        const htmlString = error.response?.data;

        // Parse the HTML string into a DOM object
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');

        const preContent = doc.querySelector('pre').innerHTML.replace(/<br\s*\/?>/gi, '\n');

        // Extract only the first line (the error message)
        const errorMessage = preContent.split('\n')[0]; // Get the first line

        setBillError(errorMessage)
      } finally {
        setIsLoading(false)

      }
    }
  };

  const clearInvoice = () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to clear the invoice?"
    );

    if (userConfirmed) {
      // Clear all the invoice-related states
      dispatch(setSelectedItems([]));
      dispatch(setFlatDiscount(0));
      dispatch(setTotalQty(0));
      dispatch(setTotalAmount(0));
      dispatch(setTotalGrossAmount(0));
      dispatch(setPaidAmount(''));
      dispatch(setPreviousBalance(0));
      dispatch(setProductName(''));
      dispatch(setProductQuantity(''));
      dispatch(setProductDiscount(''));
      dispatch(setProductPrice(''));
      dispatch(setProduct({}));
    }
  };

  const handleViewBill = (billNo) => {
    navigate(`/${primaryPath}/sales/view-bill/${billNo}`);
  }


  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter' && product) {
        handleAddProduct();
      }
    };

    document.addEventListener('keypress', handleKeyPress);

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [product]);


  // useEffect(()=> {
  //   if (customerIndex) {
  //     const prevBalance = (customerData[customerIndex].totalRemainingPayableAmount)
  //     console.log(prevBalance)
  //     dispatch(setPreviousBalance(prevBalance))
  //   }
  // }, [dispatch, customerIndex, customerData])


  useEffect(() => {

    const fetchLastBillNo = async (billType) => {
      setIsLoading(true)
      try {
        const response = await config.getLastBillNo(billType)
        // console.log("resp", response.data.nextBillNo);
        if (response) setBillNo(response.data.nextBillNo)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLastBillNo(billType)
  }, [billType])

  useEffect(() => {
    updateTotals();
  }, [selectedItems, paidAmount, previousBalance]);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 19);
      dispatch(setDate(localDateTime));
    };

    // Call the function immediately to set the initial time
    updateDateTime();

    // Set an interval to update the time every second
    const intervalId = setInterval(updateDateTime, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    if (searchQuery) {
      const results = allProducts.filter(
        (product) =>
          product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.productCode?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const top200Products = results.slice(0, 250)
      dispatch(setSearchQueryProducts(top200Products));
    } else {
      dispatch(setSearchQueryProducts([]));
    }
  }, [searchQuery, allProducts, dispatch]);
  return (!isLoading ?
    (<div className="w-full mx-auto p-2 bg-white rounded shadow-lg overflow-auto max-h-[90vh]">

      {/* Popup Modal */}
      {(isInvoiceGenerated || billError) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded shadow-lg text-center relative">
            <span className='absolute top-0 pt-1 right-2'>
              <button className='hover:text-red-700' onClick={() => {
                setIsInvoiceGenerated(false)
                setBillError('')
              }}>&#10008;</button>
            </span>
            <h2 className={`${billError && 'text-red-500'} text-lg font-thin mb-4`}>{billError ? billError : 'Invoice generated successfully!'}</h2>
            {isInvoiceGenerated &&
              <Button className='px-4 text-xs' onClick={() => handleViewBill(billNo)}>
                View Invoice
              </Button>}
          </div>
        </div>
      )}


      {/* Invoice Information */}
      <div className="mb-2">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <Input
            label='Bill No:'
            placeholder='Enter Bill Number'
            labelClass="w-28"
            divClass="flex  items-center"
            className='w-44 text-xs p-1'
            value={billNo && billNo || 0}
            readOnly
          />

          <Input
            label='Date & Time:'
            divClass="flex items-center"
            labelClass="w-28"
            className='w-44 text-xs p-1'
            type='datetime-local'
            value={date || ''}
            onChange={(e) => dispatch(setDate(e.target.value))}
          />

          <Input
            label='Description:'
            placeholder='Enter Description'
            divClass="flex items-center"
            labelClass="w-28"
            className='w-44 text-xs p-1 '
            value={description || ''}
            onChange={(e) => setDescription(e.target.value)}
          />


          {/* <div className='grid grid-cols-2'> */}
          <label className="ml-1 flex items-center">
            <span className="w-28">Bill Type: <span className='text-red-600'>*</span></span>
            <select
              onChange={(e) => setBillType(e.target.value)}
              className={`${billType === 'thermal' ? thermalColor.th100 : A4Color.a4100} border p-1 rounded text-xs w-44`}
              value={billType}
            >
              <option value="thermal">Thermal</option>
              <option value="A4">A4</option>
            </select>
          </label>

          <label className="ml-1 flex items-center">
            <span className="w-28">Payment Type: <span className='text-red-600'>*</span></span>
            <select onChange={(e) => setBillPaymentType(e.target.value)} className={`${billType === 'thermal' ? thermalColor.th100 : A4Color.a4100} border p-1 rounded text-xs w-44`}>
              <option value="cash">Cash</option>
              <option value="credit">Credit</option>
            </select>
          </label>
          {/* </div> */}

          <label className="ml-1 flex items-center">
            <span className="w-28">Customer Name:</span>
            <select onChange={(e) => {
              const customerId = e.target.value
              dispatch(setCustomer(customerId))
              const customer = customerData.find((c) => c._id === customerId)
              setCustomerFlag(customer.customerFlag)
              console.log('customerFlag', customerFlag)
            }
            } className={`${billType === 'thermal' ? thermalColor.th100 : A4Color.a4100} border p-1 rounded text-xs w-44`}>
              <option value=''>Select Customer</option>
              {customerData && customerData?.map((customer, index) => (
                <option key={index} onClick={() => setCustomerIndex(index)} value={customer._id}>{customer.customerName}</option>

              ))}
            </select>
          </label>


        </div>



      </div>

      <div className='w-full border border-gray-100 my-3'></div>

      {/* Product Search */}
      <div className="mb-2">
        <div className="grid grid-cols-2 gap-2 text-xs">

          <Input
            label='Search:'
            placeholder='Search by Name / Item code'
            divClass="flex items-center"
            labelClass="w-24"
            className='w-72 text-xs p-1'
            value={searchQuery || ''}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          // onChange={handleSearch}

          />

          <div className='flex'>

            <Input
              label='Item Name:'
              divClass="flex items-center"
              labelClass="w-24"
              className='w-44 text-xs p-1'
              value={productName ?? ''}
              readOnly

            />

            <Button
              className={`px-4 w-44  ${billType === 'thermal' ? 'hover:bg-blue-800' : 'hover:bg-gray-700'}`}
              bgColor={billType === 'thermal' ? thermalColor.th500 : A4Color.a4500}
              onClick={handleAddProduct}
            >
              <p className='text-xs text-gray-100'>Add</p>
            </Button>


          </div>

          <Input
            label='Discount %:'
            divClass="flex items-center"
            type="number"
            labelClass="w-24"
            className='w-44 text-xs p-1'
            value={productDiscount && productDiscount || ''}
            onChange={handleDiscountChange}
          >
            {discountError && <p className="pl-2 text-red-500 text-xs">{discountError}</p>}
          </Input>


          <div className='flex justify-between '>
            <Input
              label='Quantity:'
              divClass="flex items-center"
              labelClass="w-24"
              type="number"
              className='w-44 text-xs p-1'
              value={productQuantity || ''}
              onChange={handleQuantityChange}
            >
              {quantityError && <p className="pl-2 text-red-500 text-xs">{quantityError}</p>}
            </Input>

            <Button className={`w-44 px-4 ${billType === 'thermal' ? 'hover:bg-blue-800' : 'hover:bg-gray-700'}`}
              bgColor={billType === 'thermal' ? thermalColor.th500 : A4Color.a4500}
              onClick={clearInvoice}>
              <p className='text-xs text-gray-100'>Clear Invoice</p>
            </Button>
          </div>


          <Input
            label='Units / Packs:'
            divClass="flex items-center"
            labelClass="w-24"
            type="number"
            className='w-44 text-xs p-1'
            value={productUnits && productUnits || ''}
            // onChange={handleProductUnitsChange}
            readOnly
          >
            {discountError && <p className="pl-2 text-red-500 text-xs">{discountError}</p>}
          </Input>

          <div className='flex justify-between '>

            <Input
              label='Price:'
              divClass="flex items-center"
              labelClass="w-24"
              type="number"
              className='w-44 text-xs p-1'
              value={productPrice && productPrice || ''}
              onChange={handlePriceChange}
            >
              {priceError && <p className="pl-2 text-red-500 text-xs">{priceError}</p>}
            </Input>

            <Button
              className={`w-44 px-4 ${billType === 'thermal' ? 'hover:bg-blue-800' : 'hover:bg-gray-700'}`}
              bgColor={billType === 'thermal' ? thermalColor.th500 : A4Color.a4500}
              onClick={generateInvoice}
            >
              <p className='text-xs text-gray-100'>Generate Invoice</p>
            </Button>
          </div>
        </div>

        {/* Search Result Table */}
        {searchQueryProducts && searchQueryProducts.length > 0 && (
          <div className="mt-2 -ml-2 overflow-auto absolute w-[81%] max-h-72 overflow-y-auto   scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 z-20">
            <table className={`min-w-full ${billType === 'thermal' ? thermalColor.th200 : A4Color.a4200} border text-xs`}>
              <thead className={`${billType === 'thermal' ? thermalColor.th300 : A4Color.a4300} sticky -top-0  border-b shadow-sm z-10`}>
                <tr>
                  <th className="py-2 px-1 text-left">Code</th>
                  <th className="py-2 px-1 text-left">Name</th>
                  <th className="py-2 px-1 text-left">Type</th>
                  <th className="py-2 px-1 text-left">Pack</th>
                  <th className="py-2 px-1 text-left">Company</th>
                  <th className="py-2 px-1 text-left">Vendor</th>
                  <th className="py-2 px-1 text-left">Category</th>
                  <th className="py-2 px-1 text-left">Sale Price</th>
                  <th className="py-2 px-1 text-left">Total Qty</th>
                </tr>
              </thead>
              <tbody>
                {searchQueryProducts && searchQueryProducts.map((product, index) => (
                  <tr key={index} className={`${billType === 'thermal' ? 'hover:bg-blue-300' : 'hover:bg-gray-300'} border-t cursor-pointer hover:bg-gray-300`} onClick={() => {
                    handleSelectProduct(product);
                  }}>
                    <td className="px-1 py-1">{product.productCode}</td>
                    <td className="px-1 py-1">{product.productName}</td>
                    <td className="px-1 py-1">{product.typeDetails[0]?.typeName}</td>
                    <td className="px-1 py-1">{product.productPack}</td>
                    <td className="px-1 py-1">{product.companyDetails[0]?.companyName}</td>
                    <td className="px-1 py-1">{product.vendorSupplierDetails[0]?.supplierName || product.vendorCompanyDetails[0]?.companyName}</td>
                    <td className="px-1 py-1">{product.categoryDetails[0]?.categoryName}</td>
                    <td className="px-1 py-1">
                      {customerFlag === "red" ? (
                        <p>{product.salePriceDetails?.[0]?.salePrice1}</p>
                      ) : customerFlag === "green" ? (
                        <p>{product.salePriceDetails?.[0]?.salePrice2}</p>
                      ) : customerFlag === "yellow" ? (
                        <p>{product.salePriceDetails?.[0]?.salePrice3}</p> // Assuming salePrice3 for yellow
                      ) : customerFlag === "white" ? (
                        <p>{product.salePriceDetails?.[0]?.salePrice4}</p> // Assuming salePrice4 for white
                      ) : (
                        <p>{product.salePriceDetails?.[0]?.salePrice1}</p>
                      )}
                    </td>
                    <td className="px-1 py-1">{Math.ceil(product.productTotalQuantity / product.productPack)}</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Table */}
      <div>
        <div className="overflow-auto  max-h-40 scrollbar-thin">
          <table className="min-w-full bg-white border text-xs ">
            <thead className={`${billType === 'thermal' ?
              thermalColor.th300 :
              A4Color.a4300} sticky -top-0  border-b shadow-sm z-10`}>
              <tr className={` border-b`}>
                <th className="py-2 px-1 text-left">S No</th>
                <th className="py-2 px-1 text-left">Name</th>
                <th className="py-2 px-1 text-left">Qty</th>
                <th className="py-2 px-1 text-left">Units</th>
                <th className="py-2 px-1 text-left">Rate</th>
                <th className="py-2 px-1 text-left">G Amount</th>
                <th className="py-2 px-1 text-left">Extra Discount %</th>
                <th className="py-2 px-1 text-left">Net Amount</th>
                <th className="py-2 px-1 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item, index) => {
                const grossAmount = (item.salePrice1 / item.productPack * item.billItemUnit * item.quantity);
                const netAmount = (grossAmount * (1 - item.discount / 100)).toFixed(2);

                return (
                  <tr key={index} className={`border-t ${billType === 'thermal' ? thermalColor.th100 : A4Color.a4100}`}>
                    <td className=" px-1">{index + 1}</td>
                    <td className=" px-1">{item.productName}</td>
                    <td className=" px-1">
                      <Input
                        type="number"
                        className={`p-1 rounded w-16 text-xs ${billType === 'thermal' ? thermalColor.th100 : A4Color.a4100}`}
                        value={item.quantity || ''}
                        onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value))}
                      />
                    </td>
                    <td className=" px-1">
                      <Input
                        type="number"
                        className={`p-1 rounded w-16 text-xs ${billType === 'thermal' ? thermalColor.th100 : A4Color.a4100}`}
                        value={item.billItemUnit || ''}
                        max={item.productPack}
                        onChange={(e) => {
                          if (e.target.value > item.productPack || e.target.value < 1) return;
                          handleItemChange(index, "billItemUnit", parseInt(e.target.value))
                        }}
                      />
                    </td>
                    <td className=" px-1">
                      <input
                        type="text"
                        className={`p-1 rounded w-16 text-xs ${billType === 'thermal' ? thermalColor.th100 : A4Color.a4100}`}
                        value={(item.salePrice1 / item.productPack * item.billItemUnit).toFixed(2) || ''}
                        onChange={(e) => handleItemChange(index, "salePrice1", parseFloat(e.target.value))}
                      />
                    </td>
                    <td className=" px-1">{grossAmount.toFixed(2)}</td>
                    <td className=" px-1">
                      <input
                        type="text"
                        className={`p-1 rounded w-16 text-xs ${billType === 'thermal' ? thermalColor.th100 : A4Color.a4100}`}
                        value={item.discount || ''}
                        onChange={(e) => handleExtraDiscountChange(index, e.target.value)}
                      />
                    </td>
                    <td className=" px-1">{netAmount}</td>
                    <td className=" px-1">
                      <button
                        className={`px-2 py-1 text-xs text-white bg-red-500 hover:bg-red-700 rounded-lg`}
                        onClick={() => handleRemoveItem(index)}
                      >
                        <span>Remove</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>


      {/* Totals Section */}
      <div className={`mt-4 p-2 border-t border-gray-300 ${billType === 'thermal' ? thermalColor.th100 : A4Color.a4100}`}>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="col-span-1">

            <Input
              label='Total Quantity:'
              divClass="flex items-center"
              labelClass="w-40"
              className='w-24 text-xs p-1'
              value={totalQty || 0}
              readOnly
            />

          </div>

          <div className="col-span-1">
            <Input
              label='Total Discount on Items:'
              divClass="flex items-center"
              labelClass="w-40"
              className='w-24 text-xs p-1'
              value={totalAmount && ((totalGrossAmount - totalAmount).toFixed(2)) || 0}
              readOnly
            />
          </div>

          {/* total amount */}
          <div className="col-span-1">
            <Input
              label='Total Amount:'
              divClass="flex items-center"
              labelClass="w-40"
              className='w-24 text-xs p-1'
              value={totalAmount && totalAmount.toFixed(2) || 0}
              readOnly
            />
          </div>

          <div className="col-span-1">
            <Input
              label='Total GST:'
              divClass="flex items-center"
              labelClass="w-40"
              className='w-24 text-xs p-1'
              // value={totalGst && totalGst.toFixed(2)}
              readOnly
            />
          </div>

          {/* Flat discount */}
          <div className="col-span-1">
            <Input
              label='Flat Discount:'
              divClass="flex items-center"
              labelClass="w-40"
              className='w-24 text-xs p-1'
              value={flatDiscount && flatDiscount || 0}
              onChange={(e) => dispatch(setFlatDiscount(parseFloat(e.target.value)))}
            />
          </div>

          {/* paid amount */}
          <div className="col-span-1">
            <Input
              label='Paid Amount:'
              divClass="flex items-center"
              labelClass="w-40"
              className='w-24 text-xs p-1'
              value={paidAmount || 0}
              onChange={(e) => dispatch(setPaidAmount(parseFloat(e.target.value)))}
            />
          </div>

          {/* previous balance */}
          <div className="col-span-1">
            <Input
              label='Previous Balance:'
              divClass="flex items-center"
              labelClass="w-40"
              className='w-24 text-xs p-1'
              value={previousBalance || 0}
              readOnly
            />
          </div>

          {/* isPaid */}
          <div className="col-span-1">
            <Input
              label='Bill Status:'
              divClass="flex items-center"
              labelClass="w-40"
              className='w-24 text-xs p-1'
              value={isPaid}
              readOnly
            />
          </div>

          {/* Balance */}
          <div className="col-span-1">
            <Input
              label='Bill Balance:'
              divClass="flex items-center"
              labelClass="w-40"
              className='w-24 text-xs p-1'
              value={(totalAmount && (totalAmount - flatDiscount + totalGst - paidAmount).toFixed(2)) || 0}
              readOnly
            />
          </div>
        </div>
      </div>

    </div>)
    :
    (<Loader h_w='h-16 w-16 border-t-4 border-b-4' message='Loading please Wait...' />)
  );
};

export default InvoiceComponent;


// const PurchaseItemTable = ({ items, setSelectedItems }) => {
//   const [editIndex, setEditIndex] = useState(null);

//   const handleEdit = (index) => {
//     setEditIndex(index);
//   };

//   const handleChange = (index, field, value) => {
//     const newItems = [...items];

//     if (field === "quantity") {
//       // Ensure it's a valid number
//       const quantity = parseFloat(value) || 0;
//       newItems[index].quantity = quantity;

//       // Calculate new total price based on productPack logic
//       const productPack = newItems[index].productPack || 1;
//       const pricePerUnit = newItems[index].pricePerUnit / productPack;
//       newItems[index].totalPrice = quantity * pricePerUnit;
//     } else {
//       newItems[index][field] = value;
//     }

//     setItems(newItems);
//   };

//   const handleSave = () => {
//     setEditIndex(null);
//   };

//   return (
//     <table border="1" style={{ width: "100%", textAlign: "left" }}>
//       <thead>
//         <tr>
//           <th>Product</th>
//           <th>Quantity (Units/Packs)</th>
//           <th>Price per Unit</th>
//           <th>Total Price</th>
//           <th>Discount</th>
//           <th>Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {items.map((item, index) => (
//           <tr key={index}>
//             <td>{item.productName}</td>

//             {/* Quantity Input */}
//             <td>
//               {editIndex === index ? (
//                 <input
//                   type="number"
//                   value={item.quantity}
//                   onChange={(e) =>
//                     handleChange(index, "quantity", e.target.value)
//                   }
//                 />
//               ) : (
//                 item.quantity
//               )}
//             </td>

//             {/* Price per Unit (Read-only) */}
//             <td>{(item.pricePerUnit / (item.productPack || 1)).toFixed(2)}</td>

//             {/* Total Price (Auto-Calculated) */}
//             <td>{item.totalPrice.toFixed(2)}</td>

//             {/* Discount Input */}
//             <td>
//               {editIndex === index ? (
//                 <input
//                   type="number"
//                   value={item.discount}
//                   onChange={(e) =>
//                     handleChange(index, "discount", e.target.value)
//                   }
//                 />
//               ) : (
//                 item.discount
//               )}
//             </td>

//             {/* Edit/Save Button */}
//             <td>
//               {editIndex === index ? (
//                 <button onClick={handleSave}>Save</button>
//               ) : (
//                 <button onClick={() => handleEdit(index)}>Edit</button>
//               )}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };