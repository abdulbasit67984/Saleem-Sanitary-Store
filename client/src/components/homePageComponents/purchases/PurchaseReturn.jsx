/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    setSelectedItems,
    setVendorSupplier,
    setVendorCompany,
    setTotalReturnAmount,
    setReturnReason,
    resetPurchaseReturn,
} from '../../../store/slices/purchase/purchaseReturnSlice';
import Input from '../../Input';
import Button from '../../Button';
import config from '../../../features/config'; // Import API config
import { extractErrorMessage } from '../../../utils/extractErrorMessage';

const PurchaseReturn = () => {
    const dispatch = useDispatch();

    const purchaseReturn = useSelector((state) => state.purchaseReturn);

    const selectedItems = purchaseReturn?.selectedItems || [];
    const vendorSupplier = purchaseReturn?.vendorSupplier || '';
    const vendorCompany = purchaseReturn?.vendorCompany || '';
    const totalReturnAmount = purchaseReturn?.totalReturnAmount || 0;
    const returnReason = purchaseReturn?.returnReason || '';

    const companyData = useSelector((state) => state.companies.companyData);
    const supplierData = useSelector((state) => state.suppliers.supplierData);
    const { allProducts } = useSelector((state) => state.saleItems);

    const [productSearch, setProductSearch] = useState('');
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [error, setError] = useState('')

    useEffect(() => {
        if (productSearch) {
            const results = allProducts.filter(
                (product) =>
                    (product.vendorCompanyDetails[0]?._id === vendorCompany ||
                        product.vendorSupplierDetails[0]?._id === vendorSupplier) &&
                    (product.productName.toLowerCase().includes(productSearch.toLowerCase()) ||
                        product.productCode?.toLowerCase().includes(productSearch.toLowerCase()))
            );
            setFilteredProducts(results);
        } else {
            setFilteredProducts([]);
        }
    }, [productSearch, allProducts, vendorCompany, vendorSupplier]);

    const handleAddProduct = () => {
        if (product) {
            const newItem = {
                ...product,
                quantity,
                returnPrice: product.productPurchasePrice || 0,
            };
            dispatch(setSelectedItems([...selectedItems, newItem]));
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


    const handleCalculateTotal = () => {
        const total = selectedItems.reduce((sum, item) => sum + item.returnPrice * item.quantity, 0);
        dispatch(setTotalReturnAmount(total));
    };

    const handleSubmit = async () => {
        if (!vendorSupplier && !vendorCompany) {
            alert("Please select either Vendor Supplier or Vendor Company.");
            return;
        }

        if (selectedItems.length === 0) {
            alert("Please add items for return.");
            return;
        }
        setError('')
        setIsLoading(true);
        setSubmitError('');
        setSubmitSuccess(false);
        try {
            const returnItems = selectedItems.map((item) => ({
                productId: item._id,
                quantity: item.quantity,
            }));

            const response = await config.createPurchaseReturn({
                vendorSupplierId: vendorSupplier || null,
                vendorCompanyId: vendorCompany || null,
                returnItems,
                totalReturnAmount,
                returnReason,
            });

            if (response) {
                setSubmitSuccess(true);
                dispatch(resetPurchaseReturn());
            }
        } catch (error) {
            // console.log(error);
            const errorMessage = extractErrorMessage(error);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleCalculateTotal();
    }, [selectedItems]);

    return (
        <div className="p-4 bg-white rounded shadow text-xs">
            <h2 className="text-lg font-semibold mb-4">Purchase Return</h2>

            <div className='flex justify-between'>
                <div>
                    {/* Vendor Selection */}
                    <div className="mb-4 text-xs flex flex-col gap-2">
                        <label className="ml-1 flex items-center">
                            <span className="w-28">Vendor Supplier:</span>
                            <select
                                onChange={(e) => {
                                    dispatch(setVendorCompany(''))
                                    dispatch(setVendorSupplier(e.target.value))
                                }}
                                value={vendorSupplier || ''}
                                disabled={selectedItems.length !== 0}
                                className={`border p-1 rounded text-xs w-44`}>
                                <option value=''>Select Vendor Supplier</option>
                                {supplierData?.map((supplier, index) => (
                                    <option key={index} value={supplier._id}>{supplier.supplierName}</option>
                                ))}
                            </select>
                        </label>

                        <label className="ml-1 flex items-center">
                            <span className="w-28">Vendor Company:</span>
                            <select
                                onChange={(e) => {
                                    dispatch(setVendorSupplier(''))
                                    dispatch(setVendorCompany(e.target.value))
                                }}
                                disabled={selectedItems.length !== 0}
                                value={vendorCompany || ''}
                                className={`border p-1 rounded text-xs w-44`}>
                                <option value=''>Select Vendor Company</option>
                                {companyData?.map((company, index) => (
                                    <option key={index} value={company._id}>{company.companyName}</option>
                                ))}
                            </select>
                        </label>

                        <Input
                            label="Search Product"
                            placeholder="Enter product name or code"
                            labelClass="w-24"
                            className='w-72 text-xs p-1'
                            value={productSearch}
                            onChange={(e) => {
                                const value = e.target.value;

                                if (!vendorCompany && !vendorSupplier) {
                                    setError("Please select a vendor!");
                                } else if (!value.length === 0 && allProducts.length === 0) {
                                    setError("No products found for this vendor!");
                                    dispatch(setProductSearch(value));
                                } else {
                                    setError("");
                                    dispatch(setProductSearch(value));
                                }
                            }}
                        />
                    </div>
                </div>
                {error && <p className={`text-red-500 font-thin w-full text-sm px-4 text-center`}>{error}</p>}
                <div>
                    {/* Actions */}
                    <div className="flex gap-2 text-xs">
                        <Button
                            className='px-4'
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Submitting...' : 'Submit Return'}
                        </Button>
                        <Button
                            className='px-4'
                            onClick={() => dispatch(resetPurchaseReturn())}
                            variant="secondary"
                            disabled={isLoading}
                        >
                            Reset
                        </Button>
                    </div>
                </div>
            </div>

            {filteredProducts.length > 0 && (
                <div className="overflow-auto max-h-72 bg-white absolute w-[81%] shadow-md z-10">
                    <table className="min-w-full border text-xs">
                        <thead>
                            <tr>
                                <th className="text-left px-2 py-1">#</th>
                                <th className="text-left px-2 py-1">Name</th>
                                <th className="text-left px-2 py-1">Pack</th>
                                <th className="text-left px-2 py-1">Purchase Price</th>
                                <th className="text-left px-2 py-1">Total QTY</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts?.map((product, index) => (
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
                                    <td className="px-2 py-1">{product.productPurchasePrice}</td>
                                    <td className="px-2 py-1">{Math.ceil(product.productTotalQuantity / product.productPack)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="mb-4 max-h-72">
                <table className="w-full border-collapse">
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
                                <td className="p-2 text-left">{item.productName}</td>
                                <td className="p-2 text-left">
                                    <input type="number" value={item.quantity} className="border p-1 w-16" onChange={(e) => handleQuantityChange(index, e.target.value)} />
                                </td>
                                <td className="p-2 text-left">{item.returnPrice}</td>
                                <td className="p-2 text-left">{(item.returnPrice * item.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Return Reason & Total */}
            <div className="flex justify-between">
                <Input divClass='flex gap-2 items-center' placeholder="Enter Reason of Return" label="Return Reason: " className="w-72 text-xs p-1" value={returnReason} onChange={(e) => dispatch(setReturnReason(e.target.value))} />
                <Input divClass='flex gap-2 items-center' label="Total Return Amount:" className="w-48 text-xs p-1" value={totalReturnAmount} readOnly />
            </div>

        </div>
    );
};

export default PurchaseReturn;
