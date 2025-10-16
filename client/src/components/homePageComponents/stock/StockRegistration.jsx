/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import config from '../../../features/config.js'
import { useSelector, useDispatch } from 'react-redux';
import {
  setAllProducts
} from '../../../store/slices/products/productsSlice.js'
import SuccessResponseMessage from '../../SuccessResponseMessage.jsx';
import Loader from '../../../pages/Loader.jsx';

const StockRegistrationForm = () => {

  const [isCompanySelected, setIsCompanySelected] = useState(false);
  const [vendor, setVendor] = useState('supplier');
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [purchasePriceAfterDiscount, setPurchasePriceAfterDiscount] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [productCode, setProductCode] = useState('')

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const companyData = useSelector((state) => state.companies.companyData);
  const supplierData = useSelector((state) => state.suppliers.supplierData);
  const categoryData = useSelector((state) => state.categories.categoryData);
  const typeData = useSelector((state) => state.types.typeData);
  const dispatch = useDispatch()

  // console.log("comp data: ", companyData)

  const purchasePrice = watch('productPurchasePrice');
  const companyId = watch('vendorCompanyId');

  useEffect(() => {
    if (companyId && purchasePrice) {
      const selectedCompany = companyData.find((company) => company._id === companyId);
      if (selectedCompany && selectedCompany.companyDiscount) {
        const discount = (purchasePrice * selectedCompany.companyDiscount) / 100;
        setTotalDiscount(discount);
        setPurchasePriceAfterDiscount(purchasePrice - discount);
      } else {
        setTotalDiscount(0);
        setPurchasePriceAfterDiscount(purchasePrice);
      }
    } else {
      setTotalDiscount(0);
      setPurchasePriceAfterDiscount(purchasePrice || 0);
    }
  }, [companyId, purchasePrice, companyData]);

  const quantityUnit = watch('quantityUnit');

  useEffect(() => {
    if (quantityUnit === 'kg') {
      setValue('productPack', 1000);
      setValue('packUnit', 'grams');
    } else if (quantityUnit === 'ft') {
      setValue('productPack', 12);
      setValue('packUnit', 'inches');
    } else if (quantityUnit === 'ton') {
      setValue('productPack', 1000);
      setValue('packUnit', 'kg');
    } else if (quantityUnit === 'meter') {
      setValue('productPack', 100);
      setValue('packUnit', 'cm');
    } else if (quantityUnit === 'yard') {
      setValue('productPack', 3);
      setValue('packUnit', 'ft');
    }
  }, [quantityUnit, setValue]);


  const onSubmit = async (data) => {
    setLoading(true);

    console.log('data', data)

    const status = Number(data.status)
    try {
      // console.log(data);
      const cleanedData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== "")
      );
      // console.log(cleanedData);
      const finalData = {
        ...cleanedData,
        productCode: productCode
      }
      console.log('productCode', productCode)
      console.log('finalData', finalData)

      const response = await config.registerStock(finalData);
      // console.log(response.data)
      if (response && response.data) {
        setLoading(false)
        setSuccessMessage(true)
        const products = await config.fetchAllProducts()
        if (products && products.data)
          dispatch(setAllProducts(products.data))
        // setValue('productName', '');
        // setValue('productTotalQuantity', '');
        // setValue('categoryId', '');
        // setValue('typeId', '');
        // setValue('companyId', '');
        // setValue('salePrice1', '');
        // setValue('salePrice2', '');
        // setValue('salePrice3', '');
        // setValue('salePrice4', '');
        // setValue('vendorSupplierId', '');
        // setValue('vendorCompanyId', '');
        // setValue('productPurchasePrice', '');
        // setValue('packUnit', '');
      }

      // }
    } catch (error) {
      console.log(error)
      setError(error.message)
    } finally {
      setLoading(false);
    }

  };

  return loading ?
    <Loader message="Loading  Please Wait...." mt="" h_w="h-10 w-10 border-t-2 border-b-2" />
    :
    (
      <div className="max-w-4xl mx-auto p-3 mt-4 bg-white shadow-md rounded-md">
        <h2 className="text-lg text-center font-semibold mb-2">Stock Registration</h2>

        {/* Error Message Below the Heading */}
        <div className="text-xs text-red-500 mb-2 text-center">
          {errors.itemCode && <p>{errors.itemCode.message}</p>}
          {!errors.itemCode && errors.name && <p>{errors.name.message}</p>}
          {!errors.itemCode && !errors.name && errors.type && <p>{errors.type.message}</p>}
          {!errors.itemCode && !errors.name && !errors.type && errors.company && <p>{errors.company.message}</p>}
          {!errors.itemCode && !errors.name && !errors.type && !errors.company && errors.purchasePrice && <p>{errors.purchasePrice.message}</p>}
          {!errors.itemCode && !errors.name && !errors.type && !errors.company && !errors.purchasePrice && errors.supplier && <p>{errors.supplier.message}</p>}
          {!errors.itemCode && !errors.name && !errors.type && !errors.company && !errors.purchasePrice && !errors.supplier && errors.group && <p>{errors.group.message}</p>}
          {!errors.itemCode && !errors.name && !errors.type && !errors.company && !errors.purchasePrice && !errors.supplier && !errors.group && errors.pack && <p>{errors.pack.message}</p>}
          {!errors.itemCode && !errors.name && !errors.type && !errors.company && !errors.purchasePrice && !errors.supplier && !errors.group && !errors.pack && errors.status && <p>{errors.status.message}</p>}
          {!errors.itemCode && !errors.name && !errors.type && !errors.company && !errors.purchasePrice && !errors.supplier && !errors.group && !errors.pack && !errors.status && errors.totalQuantity && <p>{errors.totalQuantity.message}</p>}
        </div>

        <SuccessResponseMessage
          isOpen={successMessage}
          onClose={() => setSuccessMessage(false)}
          message={"Stock Registered successfully!"}
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div>
              {/* Item Code */}
              <div className="mb-2">
                <label className="block text-gray-700 text-xs">Item Code</label>
                <input
                  type="text"
                  {...register('productCode')}
                  className="w-full px-2 py-1 border rounded-md text-xs"
                  ref={inputRef}
                  onChange={(e) => setProductCode(e.target.value)}
                />
              </div>

              {/* Name */}
              <div className="mb-2">
                <label className="block text-gray-700 text-xs">Name: <span className='text-red-500 pr-2'>*</span></label>
                <input
                  type="text"
                  {...register('productName', { required: 'Name is required' })}
                  className="w-full px-2 py-1 border rounded-md text-xs"
                />
              </div>

              {/* Category */}
              <div className="mb-2">
                <label className="block text-gray-700 text-xs">Category:</label>
                <select
                  {...register('categoryId')}
                  className={`border p-1 text-xs rounded w-full`}
                >
                  <option value="">Select Category</option>
                  {categoryData && categoryData.map((category, index) => (
                    <option key={index} value={category._id}>{category.categoryName}</option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div className="mb-2">
                <label className="block text-gray-700 text-xs">Type: <span className='text-red-500 pr-2'>*</span></label>
                <select
                  {...register('typeId')}
                  className={`border p-1 text-xs rounded w-full`}
                >
                  <option value="">Select Type</option>
                  {typeData && typeData.map((type, index) => (
                    <option key={index} value={type._id}>{type.typeName}</option>
                  ))}
                </select>
              </div>

              {/* Company */}
              <div className="mb-2 grid grid-cols-2 gap-2">
                <div className=" items-center">
                  <label className="block text-gray-700 text-xs">Company:</label>
                  <select
                    {...register('companyId')}
                    className={`border p-1 text-xs rounded w-full`}
                  >
                    <option value="">Select Company</option>
                    {companyData && companyData.map((company, index) => (
                      <option key={index} value={company._id}>{company.companyName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-xs">Expiry Date:</label>
                  <input
                    type="date"
                    {...register('productExpiryDate')}
                    className="w-full px-2 py-1 border rounded-md text-xs"
                  />
                </div>
              </div>

              {/* Sale Prices */}
              <div className="grid grid-cols-2 gap-2">
                <div className="mb-2">
                  <label className="block text-gray-700 text-xs">Sale Price 1: <span className='text-red-500 pr-2'>*</span></label>
                  <input
                    type="text"
                    {...register('salePrice1', { required: 'Price 1 is required' })}
                    className="w-full px-2 py-1 border rounded-md text-xs"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700 text-xs">Sale Price 2</label>
                  <input
                    type="text"
                    {...register('salePrice2')}
                    className="w-full px-2 py-1 border rounded-md text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="mb-2">
                  <label className="block text-gray-700 text-xs">Sale Price 3</label>
                  <input
                    type="text"
                    {...register('salePrice3')}
                    className="w-full px-2 py-1 border rounded-md text-xs"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700 text-xs">Sale Price 4</label>
                  <input
                    type="text"
                    {...register('salePrice4')}
                    className="w-full px-2 py-1 border rounded-md text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>

              <div className="mb-2 grid grid-cols-2 gap-2">


                <div className="">

                  <label className="flex gap-1 text-gray-700 text-xs">
                    <input type="radio" name="supplier" defaultChecked id=""
                      onClick={() => {
                        setVendor('supplier')
                        setValue('vendorCompanyId', '');
                      }}
                    /> Vendor Supplier: </label>
                  <select

                    disabled={vendor !== 'supplier'}
                    {...register('vendorSupplierId')}
                    // disabled={isCompanySelected} // Disable when a company is selected
                    className={`border p-1 text-xs rounded w-full ${isCompanySelected ? 'bg-gray-100' : ''}`}
                  >
                    <option value="">Select Supplier</option>
                    {supplierData?.map((supplier, index) => (
                      <option key={index} value={supplier._id}>{supplier.supplierName}</option>
                    ))}
                  </select>
                </div>

                <div className=" items-center">

                  <label className="block text-gray-700 text-xs"><input type="radio" name="supplier" id="" onClick={() => {
                    setVendor('company')
                    setValue('vendorSupplierId', '');
                  }} /> Vendor Company: </label>
                  <select
                    disabled={vendor !== 'company'}
                    {...register('vendorCompanyId')}
                    className={`border p-1 text-xs rounded w-full`}
                  >
                    <option value="">Select Company</option>
                    {companyData && companyData.map((company, index) => (
                      <option key={index} value={company._id}>{company.companyName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Discount % */}
              <div className="mb-2">
                <label className="block text-gray-700 text-xs">Discount %:</label>
                <input
                  type="text"
                  {...register('productDiscountPercentage')}
                  className="w-full px-2 py-1 border rounded-md text-xs"
                />
              </div>


              {/* Pack */}
              <div className="flex items-center gap-2">

                <div className="mb-2">
                  <label className="block text-gray-700 text-xs">Units:</label>
                  <input
                    type="text"
                    {...register('productPack', { required: 'Pack is required' })}
                    className="w-full px-2 py-1 border rounded-md text-xs"
                    defaultValue={1}
                  />
                </div>
                <div className=''>
                  <select name="" id="" className='px-2 py-1 text-xs'
                    {...register('packUnit')}>
                    <option value="">Select Unit</option>
                    {['pcs', 'kg', 'grams', 'ft', 'inches', 'cm'].map((unit, i) => (
                      <option key={i} value={unit}>{unit.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Purchase Price */}
              <div className="mb-2">
                <label className="block text-gray-700 text-xs">Purchase Price: <span className='text-red-500 pr-2'>*</span></label>
                <input
                  type="text"
                  {...register('productPurchasePrice', { required: 'Purchase price is required' })}
                  className="w-full px-2 py-1 border rounded-md text-xs"
                />
              </div>

              {/* Discount */}
              <div className='grid grid-cols-2 gap-2'>
                <div className="mb-2">
                  <label className="block text-gray-700 text-xs">Total Discount from company:</label>
                  <input
                    type="text"
                    value={totalDiscount?.toFixed(2)}
                    className="w-full px-2 py-1 border rounded-md text-xs"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700 text-xs">Purchase Price after Discount:</label>
                  <input
                    type="text"
                    value={purchasePriceAfterDiscount}
                    className="w-full px-2 py-1 border rounded-md text-xs"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="mb-2">
                <label className="block text-gray-700 text-xs">Status:</label>
                <select
                  defaultValue={1}
                  {...register('status')}
                  className="w-full px-2 py-1 border rounded-md text-xs"
                >
                  <option value={1}>true</option>
                  <option value={0}>false</option>
                </select>
              </div>

              {/* Total Quantity */}
              <div className='flex items-center gap-2'>
                <div className="mb-2">
                  <label className="block text-gray-700 text-xs">Total Quantity: <span className='text-red-500 pr-2'>*</span></label>
                  <input
                    type="text"
                    {...register('productTotalQuantity', { required: 'Total quantity is required' })}
                    className="w-full px-2 py-1 border rounded-md text-xs"
                  />
                </div>
                <div className=''>
                  <select name="" id="" className='px-2 py-1 text-xs'
                    {...register('quantityUnit')}>
                    <option value="">Select Unit</option>
                    {['pcs', 'cotton', 'box', 'pack', 'kg', 'ton','meter', 'yard','ft'].map((unit, i) => (
                      <option key={i} value={unit}>{unit.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className='w-full flex justify-center'>
            <button
              type="submit"
              className=" bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/60 text-xs"
            >
              Register Item
            </button>
          </div>
        </form>
      </div>
    );
};

export default StockRegistrationForm;

