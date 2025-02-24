/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import config from '../../../features/config'; // Import your config
import Button from '../../Button'; // Import your Button component
import ErrorResponseMessage from '../../ErrorResponseMessage';
import SuccessResponseMessage from '../../SuccessResponseMessage';
import Loader from '../../../pages/Loader';
import { extractErrorMessage } from '../../../utils/extractErrorMessage';

const ExpenseEntry = () => {
    const [expenseAccounts, setExpenseAccounts] = useState([]);
    const [formData, setFormData] = useState({
        accountId: '',
        amount: '',
        description: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchExpenseAccounts = async () => {
            try {
                setLoading(true);
                const response = await config.getAccounts(); // Your API call
                if (response.data) {
                    // Extract expense accounts (parent accounts with subcategories)
                    const extractedExpenseAccounts = response.data.filter(account => account.accountName === "Expense");

                    if (extractedExpenseAccounts.length > 0) {
                        
                        const accounts = extractedExpenseAccounts[0].subCategories[0].individualAccounts.map((individualAccount) =>
                            ({
                                _id: individualAccount._id,
                                accountName: individualAccount.individualAccountName,
                            }
                        ))
                        
                        console.log('accounts', accounts)
                        setExpenseAccounts(accounts);
                    } else {
                        setError("No Expense Accounts Found");
                    }
                } else {
                    setError("No Expense Accounts Found");
                }
            } catch (err) {
                console.error("Error fetching expense accounts:", err);
                const errorMessage = extractErrorMessage(err);

                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchExpenseAccounts();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        // console.log('formData', formData)

        try {
            const response = await config.postExpense(formData); // Replace with your actual API call
            if (response.data) {
                setSuccess("Expense recorded successfully!");
                setFormData({  // Clear the form after successful submission
                    accountId: '',
                    amount: '',
                    description: '',
                });
            } else {
              setError(response.message || "Failed to record expense.");
            }
        } catch (err) {
            console.error("Error recording expense:", err);
            const errorMessage = extractErrorMessage(err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return loading ? 
    <Loader h_w="h-16 w-16 border-b-4 border-t-4" message="Loading Accounts...." />
    : (
        <div className="p-4 bg-white border rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Expense Entry</h2>
            {error && <p className='text-red-600'>{error}</p> }
            {success && <SuccessResponseMessage message={success} />}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="accountId" className="block text-sm font-medium text-gray-700">
                        Expense Account:
                    </label>
                    <select
                        id="accountId"
                        name="accountId"
                        value={formData.accountId}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                        required
                    >
                        <option value="">Select an account</option>
                        {expenseAccounts.map((account) => (
                            <option key={account._id} value={account._id}> {/* Assuming _id is the unique identifier */}
                                {account.accountName} {/* Replace with the actual property for account name */}
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
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="mt-4">
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Submitting...' : 'Record Expense'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ExpenseEntry;