/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Input from '../../Input';
import Button from '../../Button';
import config from '../../../features/config';
import { extractErrorMessage } from '../../../utils/extractErrorMessage';
import Loader from '../../../pages/Loader';
// import Pagination from './../Pagination'; // Assuming you have a Pagination component

const MergeBills = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [childBillIds, setChildBillIds] = useState([]);
    const [childBillNos, setChildBillNos] = useState([]);
    const [parentBillId, setParentBillId] = useState('');
    const [bills, setBills] = useState([]);
    const [mergeOption, setMergeOption] = useState('new');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const billsPerPage = 50;

    const [parentBillCurrentPage, setParentBillCurrentPage] = useState(1);
    const [parentBillPerPage] = useState(50); // Show 50 bills per page in dropdown
    const [parentBillSearchTerm, setParentBillSearchTerm] = useState('');

    useEffect(() => {
        const fetchBills = async () => {
            try {
                setIsLoading(true);
                const response = await config.fetchAllBills();
                if (response) {
                    // Filter out bills that are already merged
                    setBills(response.data.filter(bill => !bill.mergedInto));
                }
            } catch (error) {
                console.error("Failed fetching bills: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBills();
    }, []);

    // Filter bills based on search term
    const filteredBills = bills.filter(bill => {
        const searchLower = searchTerm.toLowerCase();
        return (
            bill.billNo.toLowerCase().includes(searchLower) ||
            (bill.customer?.customerName && bill.customer.customerName.toLowerCase().includes(searchLower))
        );
    });

    const filteredParentBills = bills.filter(bill => {
        if (childBillIds.includes(bill._id)) return false;

        const searchLower = parentBillSearchTerm.toLowerCase();
        return (
            bill.billNo.toLowerCase().includes(searchLower) ||
            (bill.customer?.customerName && bill.customer.customerName.toLowerCase().includes(searchLower)) 
        );
    });

    // Get current bills for pagination
    const indexOfLastBill = currentPage * billsPerPage;
    const indexOfFirstBill = indexOfLastBill - billsPerPage;
    const currentBills = filteredBills.slice(indexOfFirstBill, indexOfLastBill);
    const totalPages = Math.ceil(filteredBills.length / billsPerPage);

    const handleSubmit = async () => {
        setIsLoading(true);
        setSubmitError('');
        setSubmitSuccess(false);

        try {
            const payload = {
                childBillIds,
                ...(mergeOption === 'existing' ? { parentBillId } : {})
            };

            const response = await config.mergeBills(payload);
            if (response) {
                setParentBillId('');
                setSubmitSuccess(true);
                setChildBillIds([]);
                // Refresh bills after successful merge
                const refreshedBills = await config.fetchAllBills();
                setBills(refreshedBills.data.filter(bill => !bill.mergedInto));
            }
        } catch (err) {
            setSubmitError(extractErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handleChildBillChange = (e, billNo) => {
        const billId = e.target.value;
        if (e.target.checked) {
            if (!childBillIds.includes(billId)) {
                setChildBillIds([...childBillIds, billId]);
                if(!childBillNos.includes(billNo))
                setChildBillNos([...childBillNos, billNo])
            }
        } else {
            setChildBillIds(childBillIds.filter((id) => id !== billId));
            setChildBillNos(childBillNos.filter((no) => no !== billNo));
        }
    };

    const isFormValid = () => {
        if (childBillIds.length < 2) return false;

        if (mergeOption === 'existing') {
            return parentBillId && !childBillIds.includes(parentBillId);
        }
        return true;
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return isLoading ?
        <Loader h_w="h-16 w-16 border-b-4 border-t-4" message="Loading Bills...." />
        : (
            <div className="p-4 bg-white rounded shadow text-xs">
                <h2 className="text-lg font-semibold mb-4">Merge Bills</h2>

                {submitError && <p className="text-red-500 mb-2">{submitError}</p>}
                {submitSuccess && <p className="text-green-500 mb-2">Bills merged successfully!</p>}

                <div className="mb-2">
                    <div className="flex gap-4 mb-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="mergeOption"
                                value="new"
                                checked={mergeOption === 'new'}
                                onChange={() => setMergeOption('new')}
                                className="mr-2"
                            />
                            Create New Parent Bill
                        </label>
                        {/* <label className="flex items-center">
                            <input
                                type="radio"
                                name="mergeOption"
                                value="existing"
                                checked={mergeOption === 'existing'}
                                onChange={() => setMergeOption('existing')}
                                className="mr-2"
                            />
                            Use Existing Parent Bill
                        </label> */}
                    </div>

                    {mergeOption === 'existing' && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Select Parent Bill:
                            </label>

                            {/* Search for Parent Bill */}
                            <Input
                                type="text"
                                placeholder="Search parent bills..."
                                value={parentBillSearchTerm}
                                onChange={(e) => {
                                    setParentBillSearchTerm(e.target.value);
                                    setParentBillCurrentPage(1); // Reset to first page when searching
                                }}
                                className="w-full p-2 border rounded mb-2"
                            />

                            {/* Paginated Select Dropdown */}
                            <select
                                className="w-full p-2 border rounded"
                                value={parentBillId}
                                onChange={(e) => setParentBillId(e.target.value)}
                            >
                                <option value="">Select a bill</option>
                                {filteredParentBills
                                    .slice(
                                        (parentBillCurrentPage - 1) * parentBillPerPage,
                                        parentBillCurrentPage * parentBillPerPage
                                    )
                                    .map((bill) => (
                                        <option key={bill._id} value={bill._id}>
                                            {bill.billNo} - {bill.customer?.customerName || 'No Customer'} - {bill.totalAmount}
                                        </option>
                                    ))}
                            </select>

                            {/* Pagination Controls */}
                            {filteredParentBills.length > parentBillPerPage && (
                                <div className="flex justify-between items-center mt-2">
                                    <button
                                        onClick={() => setParentBillCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={parentBillCurrentPage === 1}
                                        className="px-3 py-1 text-xs border rounded disabled:opacity-50"
                                    >
                                        Previous
                                    </button>

                                    <span className="text-xs text-gray-600">
                                        Page {parentBillCurrentPage} of {Math.ceil(filteredParentBills.length / parentBillPerPage)}
                                    </span>

                                    <button
                                        onClick={() => setParentBillCurrentPage(prev =>
                                            prev < Math.ceil(filteredParentBills.length / parentBillPerPage) ? prev + 1 : prev
                                        )}
                                        disabled={parentBillCurrentPage >= Math.ceil(filteredParentBills.length / parentBillPerPage)}
                                        className="px-3 py-1 text-xs border rounded disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <hr className='mb-2'/>

                {/* Search Input */}
                <div className="mb-2">
                    <Input
                        type="text"
                        placeholder="Search bills by number or customer..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset to first page when searching
                        }}
                        className="w-full p-2 border rounded"
                    />
                </div>


                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Select Bills to Merge (select 2 or more):
                        <span className="ml-2 font-normal text-gray-500">
                            Showing {currentBills.length} of {filteredBills.length} filtered bills
                        </span> <br />
                        <span className='text-xs font-thin'>{childBillNos?.join(', ')}</span>
                    </label>
                    <div className="border rounded p-2 max-h-44 overflow-y-auto">
                        {currentBills.length > 0 ? (
                            <>
                                {currentBills.map((bill) => (
                                    <div key={bill._id} className="flex items-center mb-1">
                                        <input
                                            type="checkbox"
                                            id={`bill-${bill._id}`}
                                            value={bill._id}
                                            className="mr-2"
                                            onChange={e => handleChildBillChange(e, bill.billNo)}
                                            checked={childBillIds.includes(bill._id)}
                                            disabled={mergeOption === 'existing' && parentBillId === bill._id}
                                        />
                                        <label htmlFor={`bill-${bill._id}`} className="flex-1">
                                            <span className="font-medium">{bill.billNo}</span> -
                                            <span className={bill.customer?.name ? "text-blue-600" : "text-gray-500"}>
                                                {bill.customer?.customerName || 'No Customer'}
                                            </span> -
                                            <span className="font-semibold">{bill.totalAmount}</span> -
                                            <span className={`${bill.billStatus === 'paid' ? 'text-green-600' :
                                                bill.billStatus === 'unpaid' ? 'text-red-600' :
                                                    'text-yellow-600'
                                                }`}>
                                                {bill.billStatus}
                                            </span>
                                        </label>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                No bills found matching your search
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {filteredBills.length > billsPerPage && (
                        <div className="mt-4">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-500">
                        {childBillIds.length > 0 ? (
                            `${childBillIds.length} bill${childBillIds.length !== 1 ? 's' : ''} selected`
                        ) : (
                            "Please select at least 2 bills"
                        )}
                    </div>
                    <Button
                        className='px-4 py-2'
                        onClick={handleSubmit}
                        disabled={isLoading || !isFormValid()}
                    >
                        {isLoading ? 'Merging...' : 'Merge Bills'}
                    </Button>
                </div>
            </div>
        );
};

export default MergeBills;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex justify-center items-center space-x-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                Previous
            </button>

            <span className="px-3 py-1">
                Page {currentPage} of {totalPages}
            </span>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
};
