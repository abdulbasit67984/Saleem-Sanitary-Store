/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import config from '../../../features/config';
import Button from '../../Button';
import Loader from '../../../pages/Loader';
import { useSelector, useDispatch } from 'react-redux';
import { setSupplierData } from '../../../store/slices/supplier/supplierSlice';


const AddSupplier = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [isSupplierCreated, setIsSupplierCreated] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [error, setError] = useState('')


    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch();

    const onSubmit = async (data) => {
        // console.log(data);
        setIsLoading(true)

        // console.log("Raw Data:", data);

        // Filter out empty string values
        const cleanedData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== "")
        );

        console.log("Cleaned Data:", cleanedData);

        try {
          const response = await config.addSupplier(cleanedData);
          if (response) {
            setSuccessMessage(response.message)
            console.log("comp res: ", response.message)
            fetchSuppliers()
            setIsLoading(false)
            setIsSupplierCreated(true)
            reset()
          }
        } catch (error) {
          console.log("error adding supplier:", error)
        } finally {
            setIsLoading(false)
        }
    };

    
    const fetchSuppliers = async () => {
        setError('')
        try {
            const data = await config.fetchAllSuppliers()
            if (data) {
                console.log("suppliers:", data.data);
                dispatch(setSupplierData(data.data));
            }
            setIsLoading(false)
        } catch (error) {
            setError(error.message)
        }
    }


    return (
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
                <h2 className="text-lg text-center py-2 font-semibold mb-4">Add Supplier</h2>

                {/* Error Message Below the Heading */}
                <div className="text-xs text-red-500 mb-2 text-center">
                    {errors.supplierName && <p>Supplier Name is required.</p>}

                </div>

                <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
                    <div className="space-y-2 text-xs">

                        <div className="flex items-center">
                            <label className="w-40">Supplier Name: <span className='text-red-500 pr-2'>*</span></label>
                            <input
                                type="text"
                                {...register('supplierName', { required: true })}
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
                                >Add Supplier</Button>

                            )}
                        </span>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSupplier;
