/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import Input from '../../Input';
import Button from '../../Button';
import config from '../../../features/config.js'
import {
  setAllProducts
} from '../../../store/slices/products/productsSlice'
import Loader from '../../../pages/Loader.jsx';

const StockIncrease = () => {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  const [selectedProduct, setSelectedProduct] = useState(null); // Changed to null
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryProducts, setSearchQueryProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const { allProducts } = useSelector((state) => state.saleItems);

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSelectProduct = (product) => {
    setSearchQuery('');
    setSelectedProduct(product);
  };

  const onSubmit = async (data) => {
    if (selectedProduct) {
      try {
        setIsLoading(true);
        const response = await config.updateProduct(data);
        if (response && response.data) {
          console.log(response.data)
          const allProductsBefore = await config.fetchAllProducts()
          if (allProductsBefore) {
            console.log('all products', allProductsBefore)
            dispatch(setAllProducts(allProductsBefore.data));
          }
          reset();
          setSelectedProduct(null);
        }

      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    if (searchQuery) {
      const results = allProducts.filter(
        (product) =>
          product.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.productCode?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchQueryProducts(results);
    } else {
      setSearchQueryProducts([]);
    }
  }, [searchQuery, allProducts]);

  useEffect(() => {
    if (selectedProduct) {
      setValue("productId", selectedProduct._id);
      setValue("productTotalQuantity", selectedProduct.productTotalQuantity / selectedProduct.productPack);
      setValue("productPack", selectedProduct.productPack);
    } else {
      setValue("productId", '');
      setValue("productTotalQuantity", '');
      setValue("productPack", '');
    }
  }, [selectedProduct, setValue]);

  return isLoading ?
    <Loader message='Loading...' h_w="h-10 w-10 border-t-2 border-b-2" />
    : (
      <>
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto py-4 bg-white shadow rounded mt-4">
          <h2 className="text-xl text-center font-bold mb-4">Increase Stock</h2>

          {/* Product Selection */}
          <Input
            label='Select a product:'
            placeholder='Search by Name / Item code'
            divClass="gap-2 items-center py-3"
            className='text-xs p-1.5 w-72 mr-72 ml-4'
            labelClass="w-24 text-xs ml-4"
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery(e.target.value)}
            ref={inputRef}
          />

          <Input
            className="text-xs p-1.5 w-full"
            divClass="gap-2 items-center"
            labelClass='text-xs w-36'
            readOnly
            hidden
            {...register("productId")}
          />
          <div className='flex gap-4 px-5 pb-4'>

            {/* Item Code Input */}
            <Input
              label="Item Code:"
              className="text-xs p-1.5 w-full"
              divClass="gap-2 items-center"
              labelClass='text-xs w-36'
              value={selectedProduct?.productCode}
              readOnly
            />

            {/* Name Input */}
            <Input
              label="Item Name:"
              className="text-xs p-1.5 w-full"
              divClass="gap-2 items-center"
              labelClass='text-xs w-36'
              value={selectedProduct?.productName}
              readOnly
            >
              {errors.productName && <p className="text-red-500 text-xs mt-1">{errors.productName.message}</p>}
            </Input>

            <Input
              label="Item Pack/Unit:"
              className="text-xs p-1.5 w-full"
              divClass="gap-2 items-center"
              labelClass='text-xs w-36'
              {...register("productPack")}
              readOnly
            >
              {errors.productPack && <p className="text-red-500 text-xs mt-1">{errors.productPack.message}</p>}
            </Input>

            {/* Quantity Input */}
            <Input
              label="Quantity:"
              type="text"
              placeholder="Enter Quantity to Increase"
              className="text-xs p-1.5 w-full"
              divClass="gap-2 items-center"
              labelClass='text-xs w-36'
              {...register("productTotalQuantity", {
                required: "Quantity is required.",
                min: {
                  value: 1,
                  message: "Quantity must be at least 1.",
                },
              })}
            >
              {errors.productTotalQuantity && <p className="text-red-500 text-xs mt-1">{errors.productTotalQuantity.message}</p>}
            </Input>

          </div>

          <div className='w-full flex justify-center gap-2'>
            <Button type='submit' className='px-4 text-xs'>
              Increase Stock
            </Button>
          </div>
        </form>

        {/* Search Result Table */}
        {searchQueryProducts && searchQueryProducts.length > 0 && (
          <div className="overflow-auto max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 z-20">
            <table className="min-w-full bg-gray-200 border text-xs">
              <thead className='sticky -top-0 border-b shadow-sm bg-gray-300 z-10'>
                <tr>
                  <th className="py-2 px-1 text-left">Code</th>
                  <th className="py-2 px-1 text-left">Name</th>
                  <th className="py-2 px-1 text-left">Type</th>
                  <th className="py-2 px-1 text-left">Category</th>
                  <th className="py-2 px-1 text-left">Company</th>
                  <th className="py-2 px-1 text-left">Supplier</th>
                  <th className="py-2 px-1 text-left">Sale Price</th>
                  <th className="py-2 px-1 text-left">Status</th>
                  <th className="py-2 px-1 text-left">Total Qty</th>
                </tr>
              </thead>
              <tbody>
                {searchQueryProducts?.map((product, index) => (
                  <tr key={index} className="border-t cursor-pointer hover:bg-gray-300" onClick={() => handleSelectProduct(product)}>
                    <td className="px-1 py-1">{product.productCode}</td>
                    <td className="px-1 py-1">{product.productName}</td>
                    <td className="px-1 py-1">{(product.typeDetails[0]?.typeName)}</td>
                    <td className="px-1 py-1">{(product.categoryDetails[0]?.categoryName)}</td>
                    <td className="px-1 py-1">{(product.companyDetails[0]?.companyName)}</td>
                    <td className="px-1 py-1">{
                      product.vendorCompanyDetails.length > 0 ? product.vendorCompanyDetails[0].companyName : product.vendorSupplierDetails[0]?.supplierName
                    }</td>
                    <td className="px-1 py-1">{(product.salePriceDetails[0]?.salePrice1)}</td>
                    <td className="px-1 py-1">{product.status ? "active" : "inactive"}</td>
                    <td className="px-1 py-1">{product.productTotalQuantity / product.productPack}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
};

export default StockIncrease;
