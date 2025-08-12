/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import config from '../../../features/config';
import Button from '../../Button';
import Loader from '../../../pages/Loader';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../Input';
import {
    setAllProducts
} from '../../../store/slices/products/productsSlice';
import ButtonLoader from '../../ButtonLoader';

const StockSearch = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const [isStockUpdated, setIsStockUpdated] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [error, setError] = useState('');
    const [productId, setProductId] = useState('');
    const [product, setProduct] = useState(null);
    const [productName, setProductName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteId, setDeleteId] = useState('');

    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 400;

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch();

    const allProducts = useSelector(state => state.saleItems.allProducts);
    const companyData = useSelector(state => state.companies.companyData);
    const categoryData = useSelector(state => state.categories.categoryData);
    const typeData = useSelector(state => state.types.typeData);

    const inputRef = useRef(null);

    const handleEdit = (id, name, product) => {
        setProductId(id);
        setIsEdit(true);
        setProductName(name);
        setProduct(product);

        setValue('productId', id);
        setValue('productCode', product.productCode || '');
        setValue('productName', product.productName || '');
        setValue('productExpiryDate', product.productExpiryDate || '');
        setValue('salePrice1', product.salePriceDetails?.[0]?.salePrice1 || '');
        setValue('salePrice2', product.salePriceDetails?.[0]?.salePrice2 || '');
        setValue('salePrice3', product.salePriceDetails?.[0]?.salePrice3 || '');
        setValue('salePrice4', product.salePriceDetails?.[0]?.salePrice4 || '');
        setValue('categoryId', product.categoryDetails?.[0]?._id || '');
        setValue('typeId', product.typeDetails?.[0]?._id || '');
        setValue('companyId', product.companyDetails?.[0]?._id || '');
        setValue('productDiscountPercentage', product.productDiscountPercentage || '');
        setValue('productPack', product.productPack || '');
        setValue('quantityUnit', product.quantityUnit || '');
        setValue('packUnit', product.packUnit || '');
        setValue('productUnit', product.productUnit || '');
        setValue('productPurchasePrice', product.productPurchasePrice || '');
        setValue('productTotalQuantity', product.productTotalQuantity / product.productPack || '');
    };

    const handleUpdateProduct = async (data) => {
        setIsButtonLoading(true);

        const cleanedData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== "")
        );

        if (cleanedData.productId === undefined) {
            setError("No product ID found!");
            return;
        }

        if (Object.keys(cleanedData).length === 0) {
            setError("No data added to update!");
            return;
        }

        try {
            const response = await config.updateProduct(cleanedData);
            if (response) {
                setSuccessMessage(response.message);
                setIsLoading(false);
                setIsStockUpdated(true);
                setIsButtonLoading(false);
                setIsEdit(false);
                reset();

                const allProductsBefore = await config.fetchAllProducts();
                if (allProductsBefore.data) {
                    dispatch(setAllProducts(allProductsBefore.data));
                }
            }
        } catch (error) {
            console.log("error updating Product:", error);
        } finally {
            setIsLoading(false);
            setIsStockUpdated(true);
            setIsButtonLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setIsButtonLoading(true);
        setDeleteId(id);

        try {
            const response = await config.deleteProduct(id);
            if (response) {
                setSuccessMessage(response.message);
                setIsButtonLoading(false);
                setSearchQuery('');
                setDeleteId('');
                setIsLoading(false);
                setIsStockUpdated(true);

                const allProductsBefore = await config.fetchAllProducts();
                if (allProductsBefore.data) {
                    dispatch(setAllProducts(allProductsBefore.data));
                }
            }
        } catch (error) {
            console.log("error deleting Product:", error);
        } finally {
            setIsLoading(false);
            setIsStockUpdated(true);
            setDeleteId('');
            setIsButtonLoading(false);
        }
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        let results = allProducts;
        if (searchQuery) {
            results = allProducts?.filter(
                (product) =>
                    product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.productCode?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        setFilteredProducts(results);
        setCurrentPage(1);
    }, [searchQuery, allProducts]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    const exportToCSV = () => {
        const headers = [
            "Code", "Name", "Type", "Pack", "Company", "Vendor", "product Discount Percentage", "Category", "product Purchase Price", "Sale Price1", "Sale Price2", "Sale Price3", "Sale Price4", "Total Qty", "status"
        ];

        const rows = currentProducts.map(product => [
            product.productCode,
            product.productName,
            product.typeDetails[0]?.typeName,
            product.productPack,
            product.companyDetails[0]?.companyName,
            product.vendorSupplierDetails[0]?.supplierName || product.vendorCompanyDetails[0]?.companyName,
            product.productDiscountPercentage,
            product.categoryDetails[0]?.productName,
            product.productPurchasePrice,
            product.salePriceDetails[0]?.salePrice1,
            product.salePriceDetails[0]?.salePrice2,
            product.salePriceDetails[0]?.salePrice3,
            product.salePriceDetails[0]?.salePrice4,
            Math.ceil(product.productTotalQuantity / product.productPack),
            product.status
        ]);

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "products_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return !isEdit ? (
        <div className='bg-white rounded-lg'>
            <div className="w-full px-5 py-5">
                <h2 className="text-lg text-center pt-2 font-semibold mb-2">Search for Stock</h2>
                <div className="text-xs text-red-500 mb-2 text-center">
                    {error && <p>{error}</p>}
                    {errors.productName && <p>Product Name is required.</p>}
                </div>
                <div className="flex justify-between items-center mb-2">
                    <Input
                        label='Search product:'
                        placeholder='Search by Name / Code'
                        divClass="gap-2 items-center"
                        className='text-xs p-1.5 w-72'
                        labelClass="w-24 text-xs"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        ref={inputRef}
                    />
                    <button
                        onClick={exportToCSV}
                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-xs"
                    >
                        Export CSV
                    </button>
                </div>
                {currentProducts && currentProducts.length > 0 &&
                    <div className="overflow-auto max-h-80 scrollbar-thin rounded">
                        <table className="min-w-full bg-white border text-xs">
                            <thead className="sticky -top-1 border-b shadow-sm bg-gray-300 z-10">
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
                                    <th className="py-2 px-1 text-left"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentProducts.map((product, index) => (
                                    <tr key={index} className="border-t hover:bg-gray-100">
                                        <td className="px-1 py-1">{product.productCode}</td>
                                        <td className="px-1 py-1">{product.productName}</td>
                                        <td className="px-1 py-1">{product.typeDetails[0]?.typeName}</td>
                                        <td className="px-1 py-1">{product.productPack}</td>
                                        <td className="px-1 py-1">{product.companyDetails[0]?.companyName}</td>
                                        <td className="px-1 py-1">{product.vendorSupplierDetails[0]?.supplierName || product.vendorCompanyDetails[0]?.companyName}</td>
                                        <td className="px-1 py-1">{product.categoryDetails[0]?.productName}</td>
                                        <td className="px-1 py-1">{product.salePriceDetails[0]?.salePrice1}</td>
                                        <td className="px-1 py-1">{Math.ceil(product.productTotalQuantity / product.productPack)}</td>
                                        <td className="py-1 px-2 flex gap-2">
                                            <button
                                                className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded-full"
                                                onClick={() => handleDelete(product._id)}
                                            >
                                                {(isButtonLoading && product._id === deleteId) ?
                                                    <ButtonLoader /> : 'Delete'}
                                            </button>
                                            <button
                                                className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-2 rounded-full"
                                                onClick={() => handleEdit(product._id, product.productName, product)}
                                            >Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                }
                <div className="flex justify-center gap-3 mt-2 text-xs">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-2 py-1 border rounded hover:bg-gray-200"
                    >Previous</button>
                    <span className="self-center">
                        Page {currentPage} of {Math.ceil(filteredProducts.length / itemsPerPage)}
                    </span>
                    <button
                        onClick={() =>
                            setCurrentPage((prev) =>
                                prev < Math.ceil(filteredProducts.length / itemsPerPage)
                                    ? prev + 1 : prev)}
                        disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
                        className="px-2 py-1 border rounded hover:bg-gray-200"
                    >Next</button>
                </div>
            </div>
        </div>
    ) :
        <div className='w-full px-4 flex items-center'>
            {isStockUpdated && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                    <div className="bg-white p-6 rounded shadow-lg text-center relative">
                        <span className='absolute top-0 pt-1 right-2'>
                            <button className='hover:text-red-700' onClick={() => setIsStockUpdated(false)}>&#10008;</button>
                        </span>
                        <h2 className="text-lg font-thin p-4">{successMessage}</h2>
                    </div>
                </div>
            )}
            <div className="w-full px-5 max-w-lg mx-auto py-5 bg-white rounded shadow-lg">
                <span className='absolute right-80 mr-2 top-20'>
                    <button className='hover:text-red-700' onClick={() => setIsEdit(false)}>&#10008;</button>
                </span>
                <div className="max-w-6xl mx-auto p-3  bg-white rounded-md">
                    <h2 className="text-lg text-center font-semibold ">Update Product Details</h2>
                    <h5 className=" text-center font-semibold mb-2">{productName}</h5>


                    {/* Error Message Below the Heading */}
                    <div className="text-xs text-red-500 mb-2 text-center">
                        {error && <p>{error}</p>}
                    </div>

                    <form onSubmit={handleSubmit(handleUpdateProduct)}>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Left Column */}
                            <div>
                                <input
                                    type="hidden"
                                    value={productId}
                                    {...register('productId')}
                                    className="w-full px-2 py-1 border rounded-md text-xs"
                                />
                                {/* Item Code */}
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs">Item Code</label>
                                    <input
                                        type="text"
                                        {...register('productCode')}
                                        className="w-full px-2 py-1 border rounded-md text-xs"
                                    />
                                </div>

                                {/* Name */}
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs">Name</label>
                                    <input
                                        type="text"
                                        {...register('productName')}
                                        className="w-full px-2 py-1 border rounded-md text-xs"
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs">Expiry Date</label>
                                    <input
                                        type="date"
                                        {...register('productExpiryDate')}
                                        className="w-full px-2 py-1 border rounded-md text-xs"
                                    />
                                </div>

                                {/* Sale Prices */}
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs">Sale Price 1</label>
                                    <input
                                        type="text"
                                        {...register('salePrice1')}
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

                            {/* Right Column */}
                            <div>
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
                                    <label className="block text-gray-700 text-xs">Type:</label>
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
                                <div className="mb-2 items-center">
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

                                <div className="mb-2 grid grid-cols-2 gap-2 items-center">
                                    <div className="mb-2">
                                        <label className="block text-gray-700 text-xs">Pack:</label>
                                        <input
                                            type="text"
                                            {...register('productPack')}
                                            className="w-full px-2 py-1 border rounded-md text-xs"
                                        />
                                    </div>
                                    <div className=''>
                                        <select name="" id="" className='px-2 py-1 text-xs'
                                            {...register('packUnit')}>
                                            {['pcs', 'kg', 'grams', 'ft', 'inches', 'cm'].map((unit, i) => (
                                                <option key={i} value={unit}>{unit.toUpperCase()}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Purchase Price */}
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs">Purchase Price</label>
                                    <input
                                        type="text"
                                        {...register('productPurchasePrice')}
                                        className="w-full px-2 py-1 border rounded-md text-xs"
                                    />
                                </div>

                                {/* Total Quantity */}
                                <div className='mb-2 grid grid-cols-2 gap-2 items-center'>
                                    <div className="mb-2">
                                        <label className="block text-gray-700 text-xs">Total Quantity</label>
                                        <input
                                            type="text"
                                            {...register('productTotalQuantity')}
                                            className="w-full px-2 py-1 border rounded-md text-xs"
                                        />
                                    </div>
                                    <div className=''>
                                        <select name="" id="" className='px-2 py-1 text-xs'
                                            {...register('quantityUnit')}>
                                            {['pcs', 'pack', 'kg', 'ton', 'meter', 'yard', 'ft'].map((unit, i) => (
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
                                className=" bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/80 text-xs"
                            >
                                {isButtonLoading ?
                                    <ButtonLoader /> : 'Update Details'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
};

export default StockSearch;
