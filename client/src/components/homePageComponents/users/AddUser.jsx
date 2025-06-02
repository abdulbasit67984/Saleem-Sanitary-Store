import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import SuccessResponseMessage from '../../SuccessResponseMessage.jsx';
import Loader from '../../../pages/Loader.jsx';
import Button from '../../Button.jsx';
import authService from '../../../features/auth.js';

import { setCurrentUser } from '../../../store/slices/auth/authSlice.js'


const AddUserForm = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [mobileNumbers, setMobileNumbers] = useState(['']);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [error, setError] = useState('');

    const { userData } = useSelector(state => state.auth)

    const subscription = userData?.BusinessId?.subscription
    const activeUsers = userData?.BusinessId?.userCount

    const dispatch = useDispatch();


    const handleMobileNumberChange = (index, value) => {
        const newNumbers = [...mobileNumbers];
        newNumbers[index] = value;
        setMobileNumbers(newNumbers);
    };

    const addMobileNumberField = () => {
        setMobileNumbers([...mobileNumbers, '']);
    };

    const removeMobileNumberField = (index) => {
        if (mobileNumbers.length > 1) {
            const newNumbers = mobileNumbers.filter((_, i) => i !== index);
            setMobileNumbers(newNumbers);
        }
    };

    const onSubmit = async (data) => {
        if (activeUsers >= subscription) {
            setError('User limit reached according to your subscription plan');
            return;
        }

        try {
            setLoading(true);
            const userData = {
                ...data,
                mobileno: mobileNumbers.filter(num => num.trim() !== '')
            };

            const response = await authService.addNewUser(userData)
            if (response) {
                setSuccessMessage(true);
                reset();
                setMobileNumbers(['']);
                setError('');

                const res = await authService.getCurrentUser()
                if (res) {
                    dispatch(setCurrentUser(res.data))
                }
            }
        } catch (error) {
            setError(error.message || 'Failed to create user');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        console.log('userData', userData)
    }, [])

    return loading ?
        <Loader message="Creating User. Please Wait...." mt="" h_w="h-10 w-10 border-t-2 border-b-2" />
        : (
            <div className="max-w-4xl mx-auto p-3 mt-4 bg-white shadow-md rounded-md max-h-[30rem] overflow-auto scrollbar-thin">
                <h2 className="text-lg text-center font-semibold mb-2">Add New User</h2>
                <div className="flex justify-center mb-2">
                    <span className="badge bg-info">
                        {activeUsers}/{subscription} Users
                    </span>
                </div>

                {/* Error Message Below the Heading */}
                <div className="text-xs text-red-500 mb-2 text-center">
                    {error && <p>{error}</p>}
                    {!error && errors.username && <p>{errors.username.message}</p>}
                    {!error && !errors.username && errors.firstname && <p>{errors.firstname.message}</p>}
                    {!error && !errors.username && !errors.firstname && errors.password && <p>{errors.password.message}</p>}
                    {!error && !errors.username && !errors.firstname && !errors.password &&
                        mobileNumbers.every(num => !num.trim()) && <p>At least one valid mobile number is required</p>}
                </div>

                <SuccessResponseMessage
                    isOpen={successMessage}
                    onClose={() => setSuccessMessage(false)}
                    message={"User created successfully!"}
                />

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Left Column */}
                        <div>
                            {/* Username */}
                            <div className="mb-2">
                                <label className="block text-gray-700 text-xs">Username: <span className='text-red-500 pr-2'>*</span></label>
                                <input
                                    type="text"
                                    {...register('username', { required: 'Username is required' })}
                                    className="w-full px-2 py-1 border rounded-md text-xs"
                                />
                            </div>

                            {/* First Name */}
                            <div className="mb-2">
                                <label className="block text-gray-700 text-xs">First Name: <span className='text-red-500 pr-2'>*</span></label>
                                <input
                                    type="text"
                                    {...register('firstname', { required: 'First name is required' })}
                                    className="w-full px-2 py-1 border rounded-md text-xs"
                                />
                            </div>

                            {/* Last Name */}
                            <div className="mb-2">
                                <label className="block text-gray-700 text-xs">Last Name:</label>
                                <input
                                    type="text"
                                    {...register('lastname')}
                                    className="w-full px-2 py-1 border rounded-md text-xs"
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div>
                            {/* Password */}
                            <div className="mb-2">
                                <label className="block text-gray-700 text-xs">Password: <span className='text-red-500 pr-2'>*</span></label>
                                <input
                                    type="password"
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters'
                                        }
                                    })}
                                    className="w-full px-2 py-1 border rounded-md text-xs"
                                />
                            </div>

                            {/* Mobile Numbers */}
                            <div className="mb-2">
                                <label className="block text-gray-700 text-xs">Mobile Numbers: <span className='text-red-500 pr-2'>*</span></label>
                                {mobileNumbers.map((number, index) => (
                                    <div key={index} className="flex items-center mb-1">
                                        <input
                                            type="text"
                                            value={number}
                                            onChange={(e) => handleMobileNumberChange(index, e.target.value)}
                                            className="w-full px-2 py-1 border rounded-md text-xs"
                                            placeholder="Enter mobile number"
                                        />
                                        {mobileNumbers.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeMobileNumberField(index)}
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                        {index === mobileNumbers.length - 1 && (
                                            <button
                                                type="button"
                                                onClick={addMobileNumberField}
                                                className="ml-2 text-green-500 hover:text-green-700"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='w-full flex justify-center mt-4'>
                        <Button
                            type="submit"
                            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-700 text-xs"
                        >
                            Create User
                        </Button>
                    </div>
                </form>
            </div>
        );
};

export default AddUserForm;