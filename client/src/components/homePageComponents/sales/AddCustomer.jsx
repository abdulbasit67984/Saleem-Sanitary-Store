/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import config from '../../../features/config';
import Button from '../../Button';
import Loader from '../../../pages/Loader';
import { useSelector, useDispatch } from 'react-redux';
import { setCustomerData } from '../../../store/slices/customer/customerSlice'
import { extractErrorMessage } from '../../../utils/extractErrorMessage';


const AddCustomer = ({ onCustomerCreated }) => {

  const [isLoading, setIsLoading] = useState(false)
  const [isCustomerCreated, setIsCustomerCreated] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [customerId, setCustomerId] = useState(null)

  const dispatch = useDispatch()


  const userData = useSelector((state) => state.auth.userData)
  // console.log(userData)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    // console.log(data);
    setIsLoading(true)

    // console.log("Raw Data:", data);

    // Filter out empty string values
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== "")
    );

    // console.log("Cleaned Data:", cleanedData);

    try {
      const response = await config.addCustomer(cleanedData);
      if (response) {
        setSuccessMessage(response.message)
        console.log("comp res: ", response.message)
        setIsLoading(false)
        setIsCustomerCreated(true)
        // setCustomerId(response.data?._id)

        const newCustomer = response.data;

        const allCustomersBefore = await config.fetchAllCustomers()
        if (allCustomersBefore) {
          dispatch(setCustomerData(allCustomersBefore.data));
          // setError('')
          console.log(allCustomersBefore)
        }

        if (onCustomerCreated) {
          onCustomerCreated(newCustomer);
        }


        reset()
      }
    } catch (error) {
      console.log("error adding customer:", error)
      const message = extractErrorMessage(error)
      console.log('message', message)
      setErrorMessage(message)
      setTimeout(() => {
        setErrorMessage('');
      }, 4000);
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <div className='w-full px-8 flex items-center' >
      {isCustomerCreated && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded shadow-lg text-center relative">
            <span className='absolute top-0 pt-1 right-2'>
              <button className='hover:text-red-700' onClick={() => setIsCustomerCreated(false)}>&#10008;</button>
            </span>
            <h2 className="text-lg font-thin p-4">{successMessage}</h2>
          </div>
        </div>
      )}
      <div className="w-5/6 px-16 max-w-md mx-auto py-10 bg-white rounded shadow-lg" onClick={(e) =>
        e.stopPropagation()}>
        <h2 className="text-lg text-center py-2 font-semibold mb-4">Add Customer</h2>

        {/* Error Message Below the Heading */}
        <div className="text-xs text-red-500 mb-2 text-center">
          {errorMessage && <p>{errorMessage}</p>}
          {errors.customerName && <p>Customer Name is required.</p>}

        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
          <div className="space-y-2 text-xs">

            <div className="flex items-center">
              <label className="w-40">Customer Name: <span className='text-red-500 pr-2'>*</span></label>
              <input
                type="text"
                {...register('customerName', { required: true })}
                className="border p-1 rounded w-full"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40">NTN Number:</label>
              <input
                type="text"
                {...register('ntnNumber')}
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
                {...register('customerRegion')}
                className="border p-1 rounded w-full"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40">Customer Flag:</label>
              <select
                {...register('customerFlag')}
                className={`border p-1  rounded w-full`}
              >
                {/* <option value="">Select Flag</option> */}
                <option className='bg-red-500 text-white text-center' value="red">Red</option>
                <option className='bg-green-500 text-white text-center' value="green">Green</option>
                <option className='bg-yellow-500 text-center text-white' value="yellow">Yellow</option>
                <option className='bg-white  text-center' value="white">White</option>
              </select>
            </div>
          </div>

          <div className="mt-4 w-full flex justify-center">

            <button
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
                >Add Customer</Button>

              )}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;
