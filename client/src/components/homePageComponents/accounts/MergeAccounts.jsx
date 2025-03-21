/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Input from '../../Input';
import Button from '../../Button';
import config from '../../../features/config'; // Import API config
import { extractErrorMessage } from '../../../utils/extractErrorMessage';
import Loader from '../../../pages/Loader';

const MergeAccounts = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState('');
    const [parentAccountName, setParentAccountName] = useState('');
    const [childAccountIds, setChildAccountIds] = useState([]);
    const [accounts, setAccounts] = useState([]); // State to store all accounts
    const [subCategories, setSubCategories] = useState([]);
    const [individualAccounts, setIndividualAccounts] = useState([]);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
              setIsLoading(true);
              const response = await config.getAccounts();
        
              if (response) {
                const accountsData = response.data;
        
                // Set all accounts directly
                setAccounts(accountsData);
        
                // Extract and flatten subCategories from accounts
                const allSubCategories = accountsData.flatMap((account) => account.subCategories || []);
                setSubCategories(allSubCategories);
        
                // Extract and flatten individualAccounts from subCategories
                const allIndividualAccounts = allSubCategories.flatMap(
                  (subCategory) => subCategory.individualAccounts || []
                );
                setIndividualAccounts(allIndividualAccounts);
                console.log("individual accounts:", individualAccounts);
                console.log("sub category accounts:", subCategories);
                console.log(" accounts:", accounts);
        
        
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
            const response = await config.mergeAccounts({
                parentAccountName,
                childAccountIds,
            });
            if (response) {
                setParentAccountName(''); // Clear input field after successful merge.
            }

            setSubmitSuccess(true);
            setChildAccountIds([]); // Clear selected accounts after successful merge.
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

    return isLoading ? 
    <Loader h_w="h-16 w-16 border-b-4 border-t-4" message="Loading Accounts...." />
    :
     (
        <div className="p-4 bg-white rounded shadow text-xs">
            <h2 className="text-lg font-semibold mb-4">Merge Accounts</h2>

            {error && <p className="text-red-500 mb-2">{error}</p>}
            {submitError && <p className="text-red-500 mb-2">{submitError}</p>}
            {submitSuccess && <p className="text-green-500 mb-2">Accounts merged successfully!</p>}

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="parentAccount">
                    Enter Parent Account Name:
                </label>
                <Input 
                type="text"
                id="parentAccount"
                name="parentAccountName"
                placeholder="Enter account name"
                className="p-2"
                value={parentAccountName}
                onChange={(e) => setParentAccountName(e.target.value)}
                />
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
                            />
                            <label htmlFor={`account-${account._id}`}>{account.individualAccountName}</label>
                        </div>
                    ))}
                </div>
            </div>

            <Button className='px-2' onClick={handleSubmit} disabled={isLoading || !parentAccountName || childAccountIds.length === 0}>
                {isLoading ? 'Merging...' : 'Merge Accounts'}
            </Button>
        </div>
    );
};

export default MergeAccounts;