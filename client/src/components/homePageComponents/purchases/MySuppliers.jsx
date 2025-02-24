/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import config from '../../../features/config';
import { setSupplierData } from '../../../store/slices/supplier/supplierSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../pages/Loader';
import { useForm } from 'react-hook-form';
import Button from '../../Button';

function MySuppliers() {

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [newSupplierData, setNewSupplierData] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [supplierId, setSupplierId] = useState('')
  const [supplierName, setSupplierName] = useState('')

  const [isSupplierCreated, setIsSupplierCreated] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // const customerData = useSelector(state => state.customers.customerData)
  const dispatch = useDispatch()
  // console.log(customerData)

  const fetchSuppliers = async () => {
    setError('')
    try {
      const data = await config.fetchAllSuppliers()
      if (data) {
        setNewSupplierData(data.data)
        dispatch(setSupplierData(data.data));
      }
      setIsLoading(false)
    } catch (error) {
      setError(error.message)
    }
  }

  const handleEdit = (id, name) => {
    setSupplierId(id)
    setIsEdit(true)
    setSupplierName(name)
    // console.log(id)
  }




  const handleUpdateSupllier = async (data) => {
    console.log(data);
    setIsLoading(true)

    console.log("Raw Data:", data);

    // Filter out empty string values
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== "")
    );

    console.log("Cleaned Data:", cleanedData);

    try {
      const response = await config.updateSupplier(cleanedData);
      if (response) {
        setSuccessMessage(response.message)
        console.log("comp res: ", response.message)
        setIsLoading(false)
        setIsSupplierCreated(true)
        reset()
      }
    } catch (error) {
      console.log("error updating supplier:", error)
    }
  };


  useEffect(() => {
    fetchSuppliers()
  }, [isEdit])

  return !isEdit ? (!isLoading ? (
    <div className='bg-white rounded-lg'>
      <h2 className="text-lg text-center font-semibold py-4">All Suppliers</h2>
      {error && <p className="text-red-600 mt-2 mb-1 text-center text-sm">{error}</p>}
      <div className="overflow-auto max-h-72 mb-4 scrollbar-thin rounded">
        <table className="min-w-full bg-white border text-xs">
          <thead className="sticky -top-1 border-b shadow-sm bg-gray-300 z-10">
            <tr>
              <th className="py-2 px-1 text-left">S No.</th>
              <th className="py-2 px-1 text-left">Supplier Name</th>
              <th className="py-2 px-1 text-left">Mobile No.</th>
              <th className="py-2 px-1 text-left">City</th>
              <th className="py-2 px-1 text-left">Payables</th>
              <th className="py-2 px-1 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {newSupplierData && newSupplierData?.map((supplier, index) => (
              <tr key={index} className={`border-t hover:cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                <td className="py-1 px-2">{index + 1}</td>
                <td className="py-1 px-2">{supplier.supplierName}</td>
                <td className="py-1 px-2">{supplier.mobileNo}</td>
                <td className="py-1 px-2">{supplier.supplierRegion}<span className={`h-10 w-20  bg-${supplier.customerFlag}-500`}></span></td>
                <td className="py-1 px-2">{0}</td>
                <td className="py-1 px-2">
                  <button
                    className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-2 rounded-full"
                    onClick={() => handleEdit(supplier._id, supplier.supplierName)}
                  >Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : <Loader message="Loading Data Please Wait...." mt="" h_w="h-10 w-10 border-t-2 border-b-2" />)
    :
    <div className='w-full px-8 flex items-center'>
      {isSupplierCreated && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded shadow-lg text-center relative">
            <span className='absolute top-0 pt-1 right-2'>
              <button className='hover:text-red-700' onClick={() => setIsSupplierCreated(false)}>&#10008;</button>
            </span>
            <h2 className="text-lg font-thin p-4">{successMessage}</h2>
          </div>
        </div>
      )}
      <div className="w-5/6 px-16 max-w-md mx-auto py-10 bg-white rounded shadow-lg">
        <span className='absolute right-80 mr-2 top-20'>
          <button className='hover:text-red-700' onClick={() => setIsEdit(false)}>&#10008;</button>
        </span>
        <h2 className="text-lg text-center font-semibold">Update Supplier</h2>
        <h2 className="text-m text-center mb-3">{supplierName}</h2>

        <form onSubmit={handleSubmit(handleUpdateSupllier)} className='w-full'>
          <div className="space-y-2 text-xs">

            <div className="flex items-center">
              <input
                type="hidden"
                value={supplierId}
                {...register('supplierId', { required: true })}
                className="border p-1 rounded w-full"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40">Supplier Name: </label>
              <input
                type="text"
                {...register('supplierName')}
                className="border p-1 rounded w-full"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40">Mobile No:</label>
              <input
                type="text"
                {...register('mobileNo')}
                className="border p-1 rounded w-full"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40">Phone No:</label>
              <input
                type="text"
                {...register('phoneNo')}
                className="border p-1 rounded w-full"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40">Fax No:</label>
              <input
                type="text"
                {...register('faxNo')}
                className="border p-1 rounded w-full"
              />
            </div>


            <div className="flex items-center">
              <label className="w-40">Email:</label>
              <input
                type="email"
                {...register('email')}
                className="border p-1 rounded w-full"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40">CNIC:</label>
              <input
                type="text"
                {...register('cnic')}
                className="border p-1 rounded w-full"
              />
            </div>
            <div className="flex items-center">
              <label className="w-40">Region:</label>
              <input
                type="text"
                {...register('supplierRegion')}
                className="border p-1 rounded w-full"
              />
            </div>

          </div>

          <div className="mt-4 w-full flex justify-center">

            <span
              className="w-full flex justify-center pt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="loader w-4 h-4 border-2 border-t-transparent border-gray-500 rounded-full animate-spin"></span>
                  Loading...
                </div>
              ) : (
                <Button
                  type="submit"
                  className={`px-24 `}
                >Update Supplier</Button>

              )}
            </span>

          </div>
        </form>
      </div>
    </div>


}

export default MySuppliers