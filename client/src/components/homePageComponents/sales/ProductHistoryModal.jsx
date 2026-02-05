/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import config from '../../../features/config';
import Loader from '../../../pages/Loader';

const ProductHistoryModal = ({ isOpen, onClose, customerId, productId, productName, customerName }) => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && customerId && productId) {
            fetchProductHistory();
        }
    }, [isOpen, customerId, productId]);

    const fetchProductHistory = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await config.fetchProductHistoryForCustomer(customerId, productId);
            if (response?.data) {
                setHistory(response.data);
            }
        } catch (err) {
            console.error('Error fetching product history:', err);
            setError('Failed to fetch product history');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh] overflow-hidden">
                {/* Header */}
                <div className="bg-primary text-white px-6 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold">Product History</h2>
                        <p className="text-sm opacity-90">
                            {productName} - {customerName || 'Customer'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 text-2xl font-bold"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-auto max-h-[calc(85vh-120px)]">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <Loader h_w='h-10 w-10 border-t-2 border-b-2' message='Loading history...' />
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500">
                            {error}
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p className="text-lg">No previous history found</p>
                            <p className="text-sm">This product has not been sold to this customer before.</p>
                        </div>
                    ) : (
                        <>
                            {/* Summary Stats */}
                            <div className="grid grid-cols-4 gap-4 mb-4">
                                <div className="bg-blue-50 p-3 rounded-lg text-center">
                                    <p className="text-xs text-gray-500">Total Bills</p>
                                    <p className="text-xl font-bold text-blue-600">{history.length}</p>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg text-center">
                                    <p className="text-xs text-gray-500">Total Quantity</p>
                                    <p className="text-xl font-bold text-green-600">
                                        {history.reduce((sum, item) => sum + (item.quantity || 0), 0)}
                                    </p>
                                </div>
                                <div className="bg-yellow-50 p-3 rounded-lg text-center">
                                    <p className="text-xs text-gray-500">Avg Price</p>
                                    <p className="text-xl font-bold text-yellow-600">
                                        {(history.reduce((sum, item) => sum + (item.billItemPrice || 0), 0) / history.length).toFixed(2)}
                                    </p>
                                </div>
                                <div className="bg-purple-50 p-3 rounded-lg text-center">
                                    <p className="text-xs text-gray-500">Total Amount</p>
                                    <p className="text-xl font-bold text-purple-600">
                                        {history.reduce((sum, item) => sum + parseFloat(item.totalAmount || 0), 0).toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {/* History Table */}
                            <div className="overflow-auto">
                                <table className="min-w-full bg-white border text-xs">
                                    <thead className="bg-gray-100 sticky top-0">
                                        <tr>
                                            <th className="py-2 px-3 text-left border-b">S.No</th>
                                            <th className="py-2 px-3 text-left border-b">Bill No</th>
                                            <th className="py-2 px-3 text-left border-b">Date</th>
                                            <th className="py-2 px-3 text-left border-b">Bill Type</th>
                                            <th className="py-2 px-3 text-center border-b">Qty</th>
                                            <th className="py-2 px-3 text-center border-b">Units</th>
                                            <th className="py-2 px-3 text-right border-b">Price</th>
                                            <th className="py-2 px-3 text-center border-b">Discount %</th>
                                            <th className="py-2 px-3 text-right border-b">Total</th>
                                            <th className="py-2 px-3 text-center border-b">Price Change</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((item, index) => {
                                            const prevPrice = index < history.length - 1 ? history[index + 1].billItemPrice : null;
                                            const priceChange = prevPrice !== null ? item.billItemPrice - prevPrice : 0;
                                            const priceChangePercent = prevPrice ? ((priceChange / prevPrice) * 100).toFixed(1) : 0;

                                            return (
                                                <tr key={index} className="hover:bg-gray-50 border-b">
                                                    <td className="py-2 px-3">{index + 1}</td>
                                                    <td className="py-2 px-3 font-medium text-blue-600">
                                                        {item.billNo}
                                                    </td>
                                                    <td className="py-2 px-3">{formatDate(item.billDate)}</td>
                                                    <td className="py-2 px-3">
                                                        <span className={`px-2 py-1 rounded text-xs ${
                                                            item.billType === 'thermal' 
                                                                ? 'bg-blue-100 text-blue-700' 
                                                                : 'bg-green-100 text-green-700'
                                                        }`}>
                                                            {item.billType?.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="py-2 px-3 text-center">{item.quantity}</td>
                                                    <td className="py-2 px-3 text-center">{item.billItemUnit || 0}</td>
                                                    <td className="py-2 px-3 text-right font-medium">
                                                        {item.billItemPrice?.toFixed(2)}
                                                    </td>
                                                    <td className="py-2 px-3 text-center">
                                                        {item.billItemDiscount || 0}%
                                                    </td>
                                                    <td className="py-2 px-3 text-right font-medium">
                                                        {item.totalAmount}
                                                    </td>
                                                    <td className="py-2 px-3 text-center">
                                                        {priceChange !== 0 && (
                                                            <span className={`px-2 py-1 rounded text-xs ${
                                                                priceChange > 0 
                                                                    ? 'bg-red-100 text-red-700' 
                                                                    : 'bg-green-100 text-green-700'
                                                            }`}>
                                                                {priceChange > 0 ? '↑' : '↓'} {Math.abs(priceChangePercent)}%
                                                            </span>
                                                        )}
                                                        {priceChange === 0 && prevPrice !== null && (
                                                            <span className="text-gray-400">—</span>
                                                        )}
                                                        {prevPrice === null && (
                                                            <span className="text-gray-400 text-xs">First sale</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-3 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductHistoryModal;
