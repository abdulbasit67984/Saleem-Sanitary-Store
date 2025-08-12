/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Input from '../../Input'
import Button from '../../Button'
import config from "../../../features/config";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import Loader from "../../../pages/Loader";

const NewAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [individualAccounts, setIndividualAccounts] = useState([]);
  const [allIndividualAccounts, setAllIndividualAccounts] = useState([]);
  const [accountType, setAccountType] = useState(null);
  const [individualAccountError, setIndividualAccountError] = useState('');
  const [subCategoryAccountError, setSubCategoryAccountError] = useState('');
  const [accountError, setAccountError] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  
  const [editingIndividualAccount, setEditingIndividualAccount] = useState(null);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [editingAccount, setEditingAccount] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');

  const { reset, register, handleSubmit, getValues, setValue } = useForm({
    defaultValues: {
      individualAccountName: "",
      accountBalance: '',
      parentSubCategory: "",
      customerId: "",
      supplierId: "",
      companyId: "",
      accountSubCategoryName: "",
      parentAccount: "",
      accountName: ""
    },
  });

  const customerData = useSelector((state) => state.customers.customerData)
  const companyData = useSelector((state) => state.companies.companyData);
  const supplierData = useSelector((state) => state.suppliers.supplierData);


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
        setAllIndividualAccounts(allIndividualAccounts);
        // console.log("individual accounts:", individualAccounts);
        // console.log("sub category accounts:", subCategories);
        // console.log(" accounts:", accounts);


      }
    } catch (error) {
      console.error("Failed fetching accounts: ", error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleSubCategorySubmit = async (data) => {
    try {
      if (editingSubCategory) {

        const subAccountId = editingSubCategory?._id

        const response = await config.updateSubCategory(subAccountId, data);
        setSubCategories(subCategories.map(subCategory =>
          subCategory._id === editingSubCategory._id ? response.data : subCategory
        ));
        setEditingSubCategory(null);
      } else {
        const response = await config.addSubCategory(data);
        setSubCategories([...subCategories, response.data]);
      }
      setValue('accountSubCategoryName', '')
      reset();
    } catch (error) {
      console.error("Failed to register new subcategory", error);
      const htmlString = error?.response?.data;

      // Parse the HTML string into a DOM object
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');

      const preContent = doc.querySelector('pre').innerHTML.replace(/<br\s*\/?>/gi, '\n');

      // Extract only the first line (the error message)
      const errorMessage = preContent.split('\n')[0].slice(6); // Get the first line

      setSubCategoryAccountError(errorMessage)
    }
  };

  const handleAccountSubmit = async (data) => {
    try {
      if (editingAccount) {
        const accountId = editingAccount?._id

        const response = await config.updateAccount(accountId, data);
        setAccounts(accounts.map(account =>
          account._id === editingAccount._id ? response.data : account
        ));
        setEditingAccount(null);
      } else {
        const response = await config.addAccount(data);
        setAccounts([...accounts, response.data]);
      }
      reset();
    } catch (error) {
      console.error("Failed to register new account", error);

      const htmlString = error?.response?.data;

      // Parse the HTML string into a DOM object
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');

      const preContent = doc.querySelector('pre').innerHTML.replace(/<br\s*\/?>/gi, '\n');

      // Extract only the first line (the error message)
      const errorMessage = preContent.split('\n')[0].slice(6); // Get the first line

      setAccountError(errorMessage)
    }
  };

  const handleIndividualAccountSubmit = async (data) => {
    console.log(data);

    setIndividualAccountError('')
    try {
      const individualAccountId = editingIndividualAccount?._id
      if (editingIndividualAccount) {
        const response = await config.updateIndividualAccount(individualAccountId, data);
        setIndividualAccounts(individualAccounts.map(account =>
          account._id === editingIndividualAccount._id ? response.data : account
        ));
        setEditingIndividualAccount(null);
      } else {
        const response = await config.addIndividualAccount(data);
        setIndividualAccounts([...individualAccounts, response.data]);
      }
      reset();
    } catch (error) {
      console.log("failed to register new account", error);
      // console.log("error response data: ", error);

      const htmlString = error?.response?.data;

      // Parse the HTML string into a DOM object
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');

      const preContent = doc.querySelector('pre').innerHTML.replace(/<br\s*\/?>/gi, '\n');

      // Extract only the first line (the error message)
      const errorMessage = preContent.split('\n')[0].slice(6); // Get the first line

      setIndividualAccountError(errorMessage)
    }
  };

  const handleEditIndividualAccount = (account) => {
    if (!editingIndividualAccount) {
      setIndividualAccountError('')
      setSubCategoryAccountError('')
      setAccountError('')
      reset(account);
      setEditingIndividualAccount(account);
    } else {
      reset();
      setEditingIndividualAccount(null);
    }
  };

  const handleEditSubCategory = (subCategory) => {
    if (!editingSubCategory) {
      setIndividualAccountError('')
      setSubCategoryAccountError('')
      setAccountError('')
      reset(subCategory);
      setEditingSubCategory(subCategory);
    } else {
      reset();
      setEditingSubCategory(null);
    }
  };

  const handleEditAccount = (account) => {
    if (!editingAccount) {
      setIndividualAccountError('')
      setSubCategoryAccountError('')
      setAccountError('')
      reset(account);
      setEditingAccount(account);
    } else {
      reset();
      setEditingAccount(null);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [])

  useEffect(() => {
  if (searchQuery.trim() === '') {
    setIndividualAccounts(allIndividualAccounts);
  } else {
    const filtered = allIndividualAccounts.filter(account =>
      account.individualAccountName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setIndividualAccounts(filtered);
  }
}, [searchQuery, allIndividualAccounts]);

  return isLoading ?
    <Loader h_w="h-16 w-16 border-b-4 border-t-4" message="Loading Accounts...." />
    :
    (
      <div className="w-full bg-gray-50 p-4 shadow-md rounded-lg">
        <div className="grid grid-cols-3 gap-4">
          {/* Individual Accounts */}
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-m font-semibold mb-3">Individual Accounts</h2>
            {individualAccountError.length > 0 && <p className="text-red-600 mb-1 text-center text-sm">{individualAccountError}</p>}
            <form onSubmit={handleSubmit(handleIndividualAccountSubmit)} className="mb-4">
              <div className="flex flex-col gap-2">

                <Input
                  labelClass='text xs'
                  divClass='flex gap-3 items-center justify-start'
                  placeholder="Account Name"
                  className='px-4 py-2 text-xs w-52'
                  type="text"
                  {...register("individualAccountName",)}
                />
                <Input
                  labelClass='text xs'
                  divClass='flex gap-3 items-center justify-start'
                  placeholder="Balance"
                  className='px-4 py-2 text-xs w-52'
                  type="number"
                  {...register("accountBalance")}
                />
                <select
                  className="border rounded px-3 py-2 w-52 text-xs"
                  {...register("parentSubCategory",)}
                >
                  <option value="">Select Parent Subcategory</option>
                  {subCategories.map((subcategory) => (
                    <option key={subcategory._id} value={subcategory._id}>
                      {subcategory.accountSubCategoryName}
                    </option>
                  ))}
                </select>


                {/* <div className="flex gap-4">
                <Input
                label="Customer"
                labelClass='text xs'
                  divClass='flex gap-1 items-center text-xs justify-start'
                  className='px-4 py-2 text-xs'
                  type="radio"
                  value="Customer"
                  checked={accountType === "Customer"}
                  onChange={() => setAccountType("Customer")}
                />
                <Input
                  label="Supplier"
                  labelClass='text xs'
                  divClass='flex gap-1 items-center text-xs justify-start'
                  className='px-4 py-2 text-xs'
                  type="radio"
                  value="Supplier"
                  checked={accountType === "Supplier"}
                  onChange={() => setAccountType("Supplier")}
                  />
                  <Input
                  label="Company"
                  labelClass='text xs'
                  divClass='flex gap-1 items-center text-xs justify-start'
                  className='px-4 py-2 text-xs'
                  type="radio"
                  value="Company"
                  checked={accountType === "Company"}
                  onChange={() => setAccountType("Company")}
                  />
                  </div> */}

                {/* {accountType === "Customer" &&
                <select
                className="border rounded px-3 py-2 w-52 text-xs"
                {...register("customerId")}
                >
                <option value="">Select Customer</option>
                {customerData.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                  {customer.customerName}
                  </option>
                  ))}
                  </select>} */}

                {/* {accountType === "Supplier" &&
                <select
                className="border rounded px-3 py-2 w-52 text-xs"
                  {...register("supplierId")}
                >
                  <option value="">Select Supplier</option>
                  {supplierData.map((supplier) => (
                    <option key={supplier._id} value={supplier._id}>
                      {supplier.supplierName}
                    </option>
                  ))}
                </select>} */}
                {/* {accountType === "Company" &&
                <select
                className="border rounded px-3 py-2 w-52 text-xs"
                {...register("companyId")}
                >
                <option value="">Select Company</option>
                {companyData.map((company) => (
                    <option key={company._id} value={company._id}>
                      {company.companyName}
                      </option>
                      ))}
                      </select>} */}

                <Button type="submit" className="text-sm">{!editingIndividualAccount ? 'Register' : 'Update'}</Button>

                <Input 
                placeholder="Search"
                className='p-2 text-xs'
                onChange={(e) => setSearchQuery(e.target.value)}
                />

              </div>
            </form>
            <div className="overflow-auto max-h-56 mb-4 scrollbar-thin rounded">
              <table className="w-full border text-xs ">
                <thead className="bg-gray-300 sticky top-0">
                  <tr>
                    <th className="border px-3 py-2">#</th>
                    <th className="border px-3 py-2">Name</th>
                    <th className="border px-3 py-2">Balance</th>
                    <th className="border px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {individualAccounts.map((account, index) => (
                    <tr key={index} className={`border-t hover:cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                      <td className="py-1 px-2">{index + 1}</td>
                      <td className="py-1 px-2">{account.individualAccountName}</td>
                      <td className="py-1 px-2">{(account.accountBalance)?.toFixed(2)}</td>
                      <td className="py-1 px-2">

                        <button
                          className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-2 rounded-md"
                          onClick={() => handleEditIndividualAccount(account)}
                        >{(editingIndividualAccount && editingIndividualAccount._id === account._id) ? "Cancel" : "Edit"}</button>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subcategories */}
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-m font-semibold mb-4">Subcategories</h2>
            {subCategoryAccountError.length > 0 && <p className="text-red-600 mb-1 text-center text-sm">{subCategoryAccountError}</p>}
            <form onSubmit={handleSubmit(handleSubCategorySubmit)} className="mb-4">
              <div className="flex flex-col gap-2">

                <Input
                  labelClass='text xs'
                  divClass='flex gap-3 items-center justify-start'
                  placeholder="Subcategory Name"
                  className='px-4 py-2 text-xs w-52'
                  type="text"
                  {...register("accountSubCategoryName")}
                />
                <select
                  className="border rounded px-3 py-2 w-52 text-xs"
                  {...register("parentAccount")}
                >
                  <option value="">Select Parent Account</option>
                  {accounts?.map((account) => (
                    <option key={account._id} value={account._id}>{account.accountName}</option>
                  ))}
                </select>

                <Button type="submit" className="text-sm">{!editingSubCategory ? 'Register' : 'Update'}</Button>
              </div>
            </form>
            <div className="overflow-auto max-h-72 mb-4 scrollbar-thin rounded">
              <table className="w-full border text-xs">
                <thead className="bg-gray-300 sticky top-0">
                  <tr>
                    <th className="border px-3 py-2">#</th>
                    <th className="border px-3 py-2">Name</th>
                    <th className="border px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subCategories.map((subcategory, index) => (subcategory._id && (
                    <tr key={index} className={`border-t hover:cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                      <td className=" py-1 px-2">{index + 1}</td>
                      <td className="border px-2 py-1">{subcategory.accountSubCategoryName}</td>
                      <td className="border px-2 py-1">
                        <button
                          className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-2 rounded-md"
                          onClick={() => handleEditSubCategory(subcategory)}
                        >{(editingSubCategory && editingSubCategory._id === subcategory._id) ? "Cancel" : "Edit"}</button>
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Accounts */}
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-m font-semibold mb-4">Accounts</h2>
            {accountError.length > 0 && <p className="text-red-600 mb-1 text-center text-sm">{accountError}</p>}
            <form onSubmit={handleSubmit(handleAccountSubmit)} className="mb-4">
              <div className="flex flex-col gap-2">
                <Input
                  labelClass='text xs'
                  divClass='flex gap-3 items-center justify-start'
                  placeholder="Account Name"
                  className='px-4 py-2 text-xs w-52'
                  type="text"
                  {...register("accountName")}
                />
                <Button type="submit" className="text-sm">{!editingAccount ? 'Register' : 'Update'}</Button>
              </div>
            </form>
            <div className="overflow-auto max-h-80 mb-4 scrollbar-thin rounded">
              <table className="w-full border text-xs">
                <thead className="bg-gray-200 sticky top-0">
                  <tr>
                    <th className="border px-3 py-2">#</th>
                    <th className="border px-3 py-2">Name</th>
                    <th className="border px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account, index) => (
                    <tr key={index}>
                      <td className="border py-1 px-2">{index + 1}</td>
                      <td className="border px-2 py-1">{account.accountName}</td>
                      <td className="border px-2 py-1">
                        <button
                          className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-2 rounded-md"
                          onClick={() => handleEditAccount(account)}
                        >{(editingAccount && editingAccount._id === account._id) ? "Cancel" : "Edit"}</button>                  </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
};

export default NewAccount;
