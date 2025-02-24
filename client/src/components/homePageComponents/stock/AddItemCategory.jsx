/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import config from '../../../features/config';
import Button from '../../Button';
import Loader from '../../../pages/Loader';
import { useSelector, useDispatch } from 'react-redux';
import Input from '../../Input';
import { setCategoryData } from '../../../store/slices/products/categorySlice'


const AddItemCategory = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [isButtonLoading, setIsButtonLoading] = useState(false)
    const [isCategoryCreated, setIsCategoryCreated] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [isEdit, setIsEdit] = useState(false)
    const [error, setError] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [categoryName, setCategoryName] = useState('')

    const dispatch = useDispatch();

    const categoryData = useSelector((state) => state.categories.categoryData);


    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const response = await config.fetchAllCategories();
            if (response.data) {
                dispatch(setCategoryData(response.data));
                // setIsLoading(false)
            }
        } catch (error) {
            console.log("fetching categories Failed: ", error)
        } finally {
            setIsLoading(false)
        }
    }


    const onSubmit = async (data) => {
        // console.log(data);
        setIsButtonLoading(true)
        setError('')

        // console.log("Raw Data:", data);

        // Filter out empty string values
        const cleanedData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== "")
        );

        console.log("Cleaned Data:", cleanedData);

        try {
            const response = await config.createCategory(cleanedData);
            if (response) {
                setSuccessMessage(response.message)
                console.log("comp res: ", response.message)
                setIsCategoryCreated(true)
                reset()
            }
        } catch (error) {
            console.log("error adding Category:", error)
            setError(error.message)
        } finally {
            setIsLoading(false)
            setIsButtonLoading(false)
        }
    };

    const handleEdit = (id, name) => {
        setCategoryId(id)
        setIsEdit(true)
        setCategoryName(name)
        // console.log(id)
    }

    const handleUpdateCategory = async (data) => {
        console.log(data);
        setIsButtonLoading(true)

        console.log("Raw Data:", data);

        // Filter out empty string values
        const cleanedData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== "")
        );

        console.log("Cleaned Data:", cleanedData);

        try {
            const response = await config.updateCategory(cleanedData);
            if (response) {
                setSuccessMessage(response.message)
                console.log("comp res: ", response.message)
                setIsEdit(false)
                reset()
            }
        } catch (error) {
            console.log("error updating category:", error)
        } finally {
            setIsLoading(false)
            setIsCategoryCreated(true)
            setIsButtonLoading(false)
        }
    };


    useEffect(() => {
        fetchCategories();
    }, [successMessage, isCategoryCreated])

    return !isEdit ? (!isLoading ? (
        <div className='bg-white rounded-lg'>
            <div className='w-full flex items-center'>
                {isCategoryCreated && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                        <div className="bg-white p-6 rounded shadow-lg text-center relative">
                            <span className='absolute top-0 pt-1 right-2'>
                                <button className='hover:text-red-700'
                                    onClick={() => {
                                        setIsCategoryCreated(false)
                                        setIsButtonLoading(false)
                                        setSuccessMessage('')
                                    }}>&#10008;</button>
                            </span>
                            <h2 className="text-lg font-thin p-4">{successMessage}</h2>
                        </div>
                    </div>
                )}
                <div className="w-full px-10  py-5 bg-white rounded shadow-lg">
                    <h2 className="text-lg text-center pt-2 font-semibold mb-2">Add Item Category</h2>

                    {/* Error Message Below the Heading */}
                    <div className="text-xs text-red-500 mb-2 text-center">
                        {error && <p>{error}</p>}
                        {errors.categoryName && <p>Category Name is required.</p>}

                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
                        <div className="space-y-2 text-xs">

                            <div className='flex justify-start gap-6'>
                                <div className="flex items-center">
                                    <label className="w-40">Category Name: <span className='text-red-500 pr-2'>*</span></label>
                                    <Input
                                        placeholder="Enter category name"
                                        {...register('categoryName', { required: true })}
                                        divClass="flex  items-center"
                                        className="text-xs p-1 w-60 "
                                    />
                                </div>

                                <div className="flex items-center">
                                    <Input
                                        label="Description:"
                                        labelClass="w-20"
                                        divClass="flex  items-center"
                                        placeholder="Enter category description"
                                        {...register('categoryDescription')}
                                        className="text-xs p-1 w-60 "
                                    />
                                </div>
                            </div>

                        </div>

                        <div className=" w-full flex justify-center">

                            <span
                                className="w-full flex justify-center pt-4"
                                disabled={isLoading}
                            >
                                {isButtonLoading ? (
                                    <div className="flex items-center gap-2">
                                        <span className="loader w-4 h-4 border-2 border-t-transparent border-gray-500 rounded-full animate-spin"></span>
                                        Loading...
                                    </div>
                                ) : (
                                    <Button
                                        type="submit"
                                        className={`px-20 `}
                                    >Add Item Category</Button>

                                )}
                            </span>

                        </div>
                    </form>


                </div>
            </div>
            <h2 className="text-lg text-center font-semibold py-4">All Categories</h2>
            {/* {error && <p className="text-red-600 mt-2 mb-1 text-center text-sm">{error}</p>} */}
            <div className="overflow-auto max-h-64 mb-4 scrollbar-thin rounded">
                <table className="min-w-full bg-white border text-xs">
                    <thead className="sticky -top-1 border-b shadow-sm bg-gray-300 z-10">
                        <tr>
                            <th className="py-2 px-1 text-left">S No.</th>
                            <th className="py-2 px-1 text-left">Category Name</th>
                            <th className="py-2 px-1 text-left">Category Description</th>
                            <th className="py-2 px-1 text-left"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {categoryData && categoryData?.map((category, index) => (
                            <tr key={index} className={`border-t hover:cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                                <td className="py-1 px-2">{index + 1}</td>
                                <td className="py-1 px-2">{category.categoryName}</td>
                                <td className="py-1 px-2">{category.categoryDescription}</td>
                                <td className="py-1 px-2">
                                    <button
                                        className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-2 rounded-full"
                                        onClick={() => handleEdit(category._id, category.categoryName)}
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
            {isCategoryCreated && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                    <div className="bg-white p-6 rounded shadow-lg text-center relative">
                        <span className='absolute top-0 pt-1 right-2'>
                            <button className='hover:text-red-700' onClick={() => setIsCategoryCreated(false)}>&#10008;</button>
                        </span>
                        <h2 className="text-lg font-thin p-4">{successMessage}</h2>
                    </div>
                </div>
            )}
            <div className="w-5/6 px-16 max-w-md mx-auto py-10 bg-white rounded shadow-lg">
                <span className='absolute right-80 mr-2 top-20'>
                    <button className='hover:text-red-700' onClick={() => setIsEdit(false)}>&#10008;</button>
                </span>
                <h2 className="text-lg text-center font-semibold">Update Category</h2>

                <form
                    onSubmit={handleSubmit(handleUpdateCategory)}
                    className='w-full'>
                    <div className="space-y-2 text-xs">
                        <h2 className='w-full text-center py-1'>{categoryName}</h2>

                        <div className="flex items-center">
                            <input
                                type="hidden"
                                value={categoryId}
                                {...register('categoryId', { required: true })}
                                className="border p-1 rounded w-full"
                            />
                        </div>

                        <div className="flex items-center">
                            <label className="w-40">Category Name: </label>
                            <input
                                type="text"
                                {...register('categoryName')}
                                className="border p-1 rounded w-full"
                            />
                        </div>
                        <div className="flex items-center">
                            <label className="w-40">Description:</label>
                            <input
                                type="text"
                                {...register('categoryDescription')}
                                className="border p-1 rounded w-full"
                            />
                        </div>

                    </div>

                    <div className="mt-4 w-full flex justify-center">

                        <div
                            className="w-full flex justify-center pt-4"
                            disabled={isLoading}
                        >
                            {isButtonLoading ? (
                                <div className="flex items-center gap-2">
                                    <span className="loader w-4 h-4 border-2 border-t-transparent border-gray-500 rounded-full animate-spin"></span>
                                    Loading...
                                </div>
                            ) : (
                                <Button
                                    type="submit"
                                    className={`px-24 `}
                                >Update Category</Button>

                            )}
                        </div>

                    </div>
                </form>
            </div>
        </div>


};

export default AddItemCategory;
