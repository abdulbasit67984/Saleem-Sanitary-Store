/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import authService from '../features/auth.js';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../store/slices/auth/authSlice.js'; // Assuming this is used after successful signup
import { Button, Input, Logo } from './index.js'; // Assuming these components exist
import { useDispatch, useSelector } from 'react-redux'; // Keep useSelector if needed elsewhere
import { useForm, useFieldArray } from 'react-hook-form'; // Import useFieldArray and control
import { extractErrorMessage } from '../utils/extractErrorMessage.js';
import UpdateUserDetails from './UpdateUserDetails.jsx'; // Import the UpdateUserDetails component

function Signup() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // --- Restore the state for toggling to UpdateUserDetails ---
    const [isUpdateUserDetails, setIsUpdateUserDetails] = useState(false);
    // ---------------------------------------------------------

    const dispatch = useDispatch();
    // You might use useSelector here to check auth status and redirect if already logged in
    // const { authStatus } = useSelector(state => state.auth);


    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors }
    } = useForm({
        defaultValues: {
            mobileno: [''], // Start with one empty input for signup
            username: '',
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            cnic: '',
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "mobileno",
    });


    const create = async (data) => {
        setIsLoading(true);
        setError("");
        setResponseMessage("");

        try {
            const cleanedData = {
                 ...data,
                 mobileno: data.mobileno
                              .map(num => String(num || '').trim())
                              .filter(num => num !== '')
            };

            if (cleanedData.mobileno.length === 0) {
                setError("At least one mobile number is required.");
                setIsLoading(false);
                return;
            }

            console.log("Form data before sending:", cleanedData);

            const response = await authService.createAccount(cleanedData);

            if (response && response.statusCode === 201) {
                setResponseMessage(response.message || "User created successfully!");
                setShowSuccessModal(true);
                // Optional: Auto-login and redirect
                // if (response.data?.token && response.data?.userData) {
                //      dispatch(login({ userData: response.data.userData, token: response.data.token }));
                //      navigate('/dashboard');
                // }

            } else {
                 setError(extractErrorMessage(response) || "Failed to create account.");
            }

        } catch (err) {
            const errorMessage = extractErrorMessage(err);
            setError(errorMessage || "An error occurred during signup.");
        } finally {
            reset();
            setIsLoading(false);
        }
    };


    return (
        // --- Conditional rendering based on isUpdateUserDetails state ---
        isUpdateUserDetails ? (
             // Render UpdateUserDetails component if state is true
            <UpdateUserDetails setIsUpdateUserDetails={setIsUpdateUserDetails} />
        ) : (
            // Render the Signup form if state is false
            <div className="h-auto w-full flex mt-8 justify-center">

                {/* Success Modal (same as before) */}
                {showSuccessModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                        <div className="bg-white p-6 rounded shadow-lg text-center relative">
                            <span className='absolute top-0 pt-1 right-2'>
                                <button className='hover:text-red-700' onClick={() => setShowSuccessModal(false)}>&#10008;</button>
                            </span>
                            <h2 className="text-lg font-thin p-4">{responseMessage}</h2>
                        </div>
                    </div>
                )}

                <div className="w-4/6 bg-gray-100 rounded-lg p-6 border border-gray-300">
                    <h2 className="text-center text-lg font-bold leading-tight">Sign up to create account</h2>
                    <p className="mt-1 text-center text-sm text-black/60">
                        Already have an account?&nbsp;
                        <Link
                            to="/login"
                            className="font-medium text-primary transition-all duration-200 hover:underline"
                        >
                            Sign In
                        </Link>
                    </p>
                    {error && <p className="text-red-600 mt-2 mb-1 text-center text-sm">{error}</p>}

                    <form onSubmit={handleSubmit(create)}>
                        <div className='grid grid-cols-2 gap-2 pt-4'>
                            {/* Other input fields */}
                            <Input 
                            label="First Name: " 
                                labelClass='text-sm w-36'
                                placeholder="Enter first name"
                                className="text-xs p-1.5 w-full"
                                divClass=" gap-2 items-center"
                            {...register("firstname", { required: true })} 
                            />
                            <Input 
                            label="Last Name: " 
                                labelClass='text-sm w-36'
                                placeholder="Enter last name"
                                className="text-xs p-1.5 w-full"
                                divClass=" gap-2 items-center"
                            {...register("lastname")} 
                            />
                            <Input 
                            label="Username: " 
                                labelClass='text-sm w-36'
                                placeholder="Enter Username"
                                className="text-xs p-1.5 w-full"
                                divClass=" gap-2 items-center"
                            {...register("username", { required: true })} 
                            />
                            <Input 
                            label="Email: " 
                                labelClass='text-sm w-36'
                                placeholder="Enter email"
                                className="text-xs p-1.5 w-full"
                                divClass=" gap-2 items-center"
                            type="email" 
                            {...register("email", 
                                {
                                validate: {
                                    matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address",
                                }
                            })} />
                            <Input 
                            label="Password: " 
                                labelClass='text-sm w-36'
                                placeholder="Enter password"
                                className="text-xs p-1.5 w-full"
                                divClass=" gap-2 items-center"
                            type="password" 
                            {...register("password", { required: true })} 
                            />
                            <Input 
                            label="CNIC: " 
                                labelClass='text-sm w-36'
                                placeholder="Enter cnic"
                                className="text-xs p-1.5 w-full"
                                divClass=" gap-2 items-center"
                            {...register("cnic")} 
                            />

                            {/* Dynamically rendered Mobile Number Inputs */}
                            <div className="col-span-2 flex flex-col gap-2">
                                <label className="text-sm w-36">Mobile Numbers:</label>
                                {fields.map((item, index) => (
                                    <div key={item.id} className="flex gap-2 items-center">
                                        <Input
                                            placeholder={`Mobile Number ${index + 1}`}
                                            className="text-xs p-1.5 flex-grow"
                                            {...register(`mobileno.${index}`, {
                                                required: index === 0 ? "At least one mobile number is required" : false,
                                            })}
                                        />
                                        {fields.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => append('')}
                                    className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm w-36  "
                                >
                                    Add Mobile Number
                                </button>
                            </div>

                        </div>
                        <div className="w-full flex justify-center pt-4">
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <span className="loader w-4 h-4 border-2 border-t-transparent border-gray-500 rounded-full animate-spin"></span>
                                    Loading...
                                </div>
                            ) : (
                                <Button
                                    type="submit"
                                    className={`px-24 `}
                                    disabled={isLoading}
                                >Create Account</Button>
                            )}
                        </div>
                    </form>

                    {/* --- Button to toggle to UpdateUserDetails --- */}
                    <p className='text-center py-3'>
                        <button
                            className='text-blue-700'
                            onClick={() => setIsUpdateUserDetails(true)}
                        >Update </button>
                        <span> Account details</span>
                    </p>
                    {/* --------------------------------------------- */}

                </div>
            </div>
        ) // End of conditional rendering for Signup form
    );
}

export default Signup;