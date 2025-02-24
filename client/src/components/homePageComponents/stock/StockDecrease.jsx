/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import Input from '../../Input';
import Button from '../../Button';
import config from '../../../features/config.js'

const StockIncrease = () => {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  const [selectedProduct, setSelectedProduct] = useState(null); // Changed to null
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryProducts, setSearchQueryProducts] = useState([]);

  const dispatch = useDispatch();
  const { allProducts } = useSelector((state) => state.saleItems);

  const handleSelectProduct = (product) => {
    setSearchQuery('');
    setSelectedProduct(product);
  };

  const onSubmit = async (data) => {
    console.log(data);
    if (selectedProduct) {
      const decreaseQuantity = parseInt(data.quantity);
      if (decreaseQuantity > selectedProduct.totalQuantity) {
        alert("Error: Quantity to decrease exceeds current stock.");
        return;
      }
      const response = await config.decreaseStock(data)
      reset();
      setSelectedProduct(null);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      const results = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.itemCode.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchQueryProducts(results);
    } else {
      setSearchQueryProducts([]);
    }
  }, [searchQuery, allProducts]);

  useEffect(() => {
    if (selectedProduct) {
      setValue("itemCode", selectedProduct.itemCode);
      setValue("name", selectedProduct.name);
      setValue("id", selectedProduct.id);
    }
  }, [selectedProduct, setValue]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto py-4 bg-white shadow rounded mt-4">
        <h2 className="text-xl text-center font-bold mb-4">Decrease Stock</h2>

        {/* Product Selection */}
        <Input
          label='Select a product:'
          placeholder='Search by Name / Item code'
          divClass="gap-2 items-center py-3"
          className='text-xs p-1.5 w-72 mr-72 ml-4'
          labelClass="w-24 text-xs ml-4"
          value={searchQuery || ''}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className='flex gap-4 px-5 pb-4'>

          {/* Item Code Input */}
          <Input
            label="Item Code:"
            className="text-xs p-1.5 w-full"
            divClass="gap-2 items-center"
            labelClass='text-xs w-36'
            value={selectedProduct && selectedProduct.itemCode || ''}
            readOnly
          />
          <Input
            label="Item id:"
            className="text-xs p-1.5 w-full"
            divClass="gap-2 items-center"
            labelClass='text-xs w-36'
            value={selectedProduct && selectedProduct.id || ''}
            readOnly
            {...register("id", { required: "Item id is required." })}
          >
            {errors.id && <p className="text-red-500 text-xs mt-1">{errors.id.message}</p>}
          </Input>

          {/* Name Input */}
          <Input
            label="Item Name:"
            className="text-xs p-1.5 w-full"
            divClass="gap-2 items-center"
            labelClass='text-xs w-36'
            value={selectedProduct && selectedProduct.name || ''}
            readOnly
            {...register("name", { required: "Name is required." })}
          >
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </Input>

          {/* Quantity Input */}
          <Input
            label="Quantity:"
            type="text"
            placeholder="Enter Quantity to Decrease"
            className="text-xs p-1.5 w-full"
            divClass="gap-2 items-center"
            labelClass='text-xs w-36'
            {...register("quantity", {
              required: "Quantity is required.",
              min: {
                value: 1,
                message: "Quantity must be at least 1.",
              },
            })}
          >
            {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
          </Input>
        </div>

        {/* reason Input */}
        <div className='w-full flex justify-center pl-4'>
          <Input
            label="Reason To Decrease:"
            placeholder="Write reason to decrease"
            className="text-xs p-2 w-3/5"
            divClass="gap-2 items-center pb-4"
            labelClass='text-xs w-36'
            {...register("reason")}
          />
        </div>

        <div className='w-full flex justify-center'>
          <Button className='px-4 text-xs'>
            Decrease Stock
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
                <th className="py-2 px-1 text-left">Company</th>
                <th className="py-2 px-1 text-left">Supplier</th>
                <th className="py-2 px-1 text-left">Group</th>
                <th className="py-2 px-1 text-left">Sale Price</th>
                <th className="py-2 px-1 text-left">Status</th>
                <th className="py-2 px-1 text-left">Total Qty</th>
              </tr>
            </thead>
            <tbody>
              {searchQueryProducts.map((product, index) => (
                <tr key={index} className="border-t cursor-pointer hover:bg-gray-300" onClick={() => handleSelectProduct(product)}>
                  <td className="px-1 py-1">{product.itemCode}</td>
                  <td className="px-1 py-1">{product.name}</td>
                  <td className="px-1 py-1">{product.type}</td>
                  <td className="px-1 py-1">{product.company}</td>
                  <td className="px-1 py-1">{product.supplier}</td>
                  <td className="px-1 py-1">{product.group}</td>
                  <td className="px-1 py-1">{product.salePrice1}</td>
                  <td className="px-1 py-1">{product.status}</td>
                  <td className="px-1 py-1">{product.totalQuantity}</td>
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
