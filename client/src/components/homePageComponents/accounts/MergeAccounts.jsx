import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Input from '../../Input';
import Button from '../../Button';
import config from '../../../features/config';
import { extractErrorMessage } from '../../../utils/extractErrorMessage';
import Loader from '../../../pages/Loader';

const MergeAccounts = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [parentAccountName, setParentAccountName] = useState('');
    const [childAccountIds, setChildAccountIds] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [individualAccounts, setIndividualAccounts] = useState([]);
    const [existingParentAccountId, setExistingParentAccountId] = useState('');
    const [mergeOption, setMergeOption] = useState('new'); // 'new' or 'existing'

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                setIsLoading(true);
                const response = await config.getAccounts();
        
                if (response) {
                    const accountsData = response.data;
                    setAccounts(accountsData);
        
                    const allSubCategories = accountsData.flatMap((account) => account.subCategories || []);
                    setSubCategories(allSubCategories);
        
                    const allIndividualAccounts = allSubCategories.flatMap(
                        (subCategory) => subCategory.individualAccounts || []
                    );
                    setIndividualAccounts(allIndividualAccounts);
                }
            } catch (error) {
                console.error("Failed fetching accounts: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    const handleSubmit = async () => {
        setIsLoading(true);
        setSubmitError('');
        setSubmitSuccess(false);

        try {
            const payload = {
                childAccountIds,
                ...(mergeOption === 'new' ? { parentAccountName } : { existingParentAccountId })
            };

            const response = await config.mergeAccounts(payload);
            if (response) {
                setParentAccountName('');
                setExistingParentAccountId('');
            }

            setSubmitSuccess(true);
            setChildAccountIds([]);
        } catch (err) {
            setSubmitError(extractErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handleChildAccountChange = (e) => {
        const accountId = e.target.value;
        if (e.target.checked) {
            if (!childAccountIds.includes(accountId)) {
                setChildAccountIds([...childAccountIds, accountId]);
            }
        } else {
            setChildAccountIds(childAccountIds.filter((id) => id !== accountId));
        }
    };

    const isFormValid = () => {
        if (childAccountIds.length === 0) return false;
        
        if (mergeOption === 'new') {
            return parentAccountName.trim() !== '';
        } else {
            return existingParentAccountId !== '';
        }
    };

    return isLoading ? 
        <Loader h_w="h-16 w-16 border-b-4 border-t-4" message="Loading Accounts...." />
    : (
        <div className="p-4 bg-white rounded shadow text-xs">
            <h2 className="text-lg font-semibold mb-4">Merge Accounts</h2>

            {submitError && <p className="text-red-500 mb-2">{submitError}</p>}
            {submitSuccess && <p className="text-green-500 mb-2">Accounts merged successfully!</p>}

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Merge Option:</label>
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
                        Create New Parent Account
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="mergeOption"
                            value="existing"
                            checked={mergeOption === 'existing'}
                            onChange={() => setMergeOption('existing')}
                            className="mr-2"
                        />
                        Use Existing Parent Account
                    </label>
                </div>

                {mergeOption === 'new' ? (
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="parentAccount">
                            New Parent Account Name:
                        </label>
                        <Input 
                            type="text"
                            id="parentAccount"
                            name="parentAccountName"
                            placeholder="Enter new account name"
                            className="p-2"
                            value={parentAccountName}
                            onChange={(e) => setParentAccountName(e.target.value)}
                        />
                    </div>
                ) : (
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="existingParent">
                            Select Existing Parent Account:
                        </label>
                        <select
                            id="existingParent"
                            className="w-full p-2 border rounded"
                            value={existingParentAccountId}
                            onChange={(e) => setExistingParentAccountId(e.target.value)}
                        >
                            <option value="">Select an account</option>
                            {individualAccounts
                                .filter(account => !childAccountIds.includes(account._id)) // Exclude selected child accounts
                                .map((account) => (
                                    <option key={account._id} value={account._id}>
                                        {account.individualAccountName}
                                    </option>
                                ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Select Accounts to Merge:
                </label>
                <div className="border rounded p-2 max-h-40 overflow-y-auto">
                    {individualAccounts?.map((account) => (
                        <div key={account._id} className="flex items-center mb-1">
                            <input
                                type="checkbox"
                                id={`account-${account._id}`}
                                value={account._id}
                                className="mr-2"
                                onChange={handleChildAccountChange}
                                checked={childAccountIds.includes(account._id)}
                                disabled={existingParentAccountId === account._id}
                            />
                            <label htmlFor={`account-${account._id}`}>{account.individualAccountName}</label>
                        </div>
                    ))}
                </div>
            </div>

            <Button 
                className='px-2' 
                onClick={handleSubmit} 
                disabled={isLoading || !isFormValid()}
            >
                {isLoading ? 'Merging...' : 'Merge Accounts'}
            </Button>
        </div>
    );
};

export default MergeAccounts;