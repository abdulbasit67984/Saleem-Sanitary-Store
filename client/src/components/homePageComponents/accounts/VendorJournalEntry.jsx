/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import config from '../../../features/config'; // Import your config
import Button from '../../Button'; // Import your Button component
import ErrorResponseMessage from '../../ErrorResponseMessage';
import SuccessResponseMessage from '../../SuccessResponseMessage';
import Loader from '../../../pages/Loader';
import { extractErrorMessage } from '../../../utils/extractErrorMessage';

const VendorJournalEntry = () => {
    const [vendorAccounts, setVendorAccounts] = useState([]);
    const [formData, setFormData] = useState({
        vendorAccountId: '',
        amount: '',
        description: '',
        details: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchVendorAccounts = async () => {
            try {
                setLoading(true);
                const response = await config.getAccounts(); // Your API call
                if (response.data) {
                    // Extract Vendor accounts
                    const extractedVendorAccounts = response.data.filter(account => account.accountName === "Liability");
                    
                    if (extractedVendorAccounts.length > 0) {
                        const accountCategories = extractedVendorAccounts[0].subCategories.filter((subCategory) => subCategory.accountSubCategoryName === "Current Liability");
                        

                        const accounts = accountCategories[0].individualAccounts.filter((account) => (
                            account.supplierId ||
                            account.companyId||
                            account.supplierId !== null ||
                            account.companyId !== null
                        ))
                        

                        setVendorAccounts(accounts);
                    } else {
                        setError("No Vendor Accounts Found");
                    }
                } else {
                    setError("No Vendor Accounts Found");
                }
            } catch (err) {
                console.error("Error fetching vendor accounts:", err);
                const errorMessage = extractErrorMessage(err);
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchVendorAccounts();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await config.postVendorJournalEntry(formData); 
            if (response) {
                setSuccess("Vendor journal entry recorded successfully!");
                setFormData({
                    vendorAccountId: '',
                    amount: '',
                    description: '',
                    details: '',
                });
            } else {
                setError(response.message || "Failed to record vendor journal entry.");
            }
        } catch (err) {
            console.error("Error recording vendor journal entry:", err);
            const errorMessage = extractErrorMessage(err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return loading ? (
        <Loader h_w="h-16 w-16 border-b-4 border-t-4" message="Loading Vendor Accounts..." />
    ) : (
        <div className="p-4 bg-white border rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Vendor Journal Entry</h2>
            {error && <p className='text-red-600'>{error}</p>}
            {success && <p className='text-green-600'>{success}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="vendorAccountId" className="block text-sm font-medium text-gray-700">
                        Vendor Account:
                    </label>
                    <select
                        id="vendorAccountId"
                        name="vendorAccountId"
                        value={formData.vendorAccountId}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                        required
                    >
                        <option value="">Select a vendor</option>
                        {vendorAccounts.map((account) => (
                            <option key={account._id} value={account._id}>
                                {account.individualAccountName}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                        Amount:
                    </label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description (Optional):
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={2}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="details" className="block text-sm font-medium text-gray-700">
                        Details:
                    </label>
                    <textarea
                        id="details"
                        name="details"
                        value={formData.details}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                        
                    />
                </div>

                <div className="mt-4">
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Submitting...' : 'Record Entry'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default VendorJournalEntry;
