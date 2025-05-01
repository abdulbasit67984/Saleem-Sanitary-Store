/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import authService from '../features/auth.js'; // Assuming authService is your API service
import { useNavigate } from 'react-router-dom';
import { Button, Input } from './index.js'; // Assuming Button and Input components exist
import { useDispatch, useSelector } from 'react-redux';
import { useForm, useFieldArray } from 'react-hook-form'; // Import useFieldArray
import { extractErrorMessage } from '../utils/extractErrorMessage.js';
import { setCurrentUser } from '../store/slices/auth/authSlice.js';

function UpdateUserDetails({setIsUpdateUserDetails}) {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.auth.userData);
    const authStatus = useSelector(state => state.auth.status);


    const {
        register,
        handleSubmit,
        reset,
        control, // Get control object for useFieldArray
        formState: { errors }
    } = useForm({
        defaultValues: {
            // Initialize mobileno as an array from currentUser or an empty array
            mobileno: currentUser?.mobileno || [],
            username: currentUser?.username || '',
            firstname: currentUser?.firstname || '',
            lastname: currentUser?.lastname || '',
            email: currentUser?.email || '',
            cnic: currentUser?.cnic || '',
        }
    });

    // --- Use useFieldArray to manage the list of mobile number inputs ---
    const { fields, append, remove } = useFieldArray({
        control, // Pass the control object from useForm
        name: "mobileno", // The name of the array field in your form data
    });
    // -------------------------------------------------------------------


    // Effect to reset the form whenever currentUser data changes
    useEffect(() => {
        if (currentUser) {
            reset({
                // Ensure mobileno is an array when resetting
                mobileno: currentUser.mobileno || [],
                username: currentUser.username || '',
                firstname: currentUser.firstname || '',
                lastname: currentUser.lastname || '',
                email: currentUser.email || '',
                cnic: currentUser.cnic || '',
            });
        }
    }, [currentUser, reset]);


    useEffect(() => {
        if (!authStatus) {
            // Optional: Redirect if not authenticated
            // navigate('/login');
        }
    }, [authStatus, navigate]);


    const updateDetails = async (data) => {
        setIsUpdating(true);
        setError("");
        setResponseMessage("");

        try {
            // data.mobileno will automatically be an array of strings
            // because useFieldArray manages inputs under the "mobileno" name
            console.log("Form data before sending:", data);

            const response = await authService.updateUserDetails(data); // Send the whole data object

            if (response && response.statusCode === 200) {
                setResponseMessage(response.message || "Profile updated successfully!");
                setShowSuccessModal(true);

                if (response.data) {
                    // Dispatch the updated user data (which includes the new mobileno array)
                    dispatch(setCurrentUser(response.data));
                }

            } else {
                setError(extractErrorMessage(response) || "Failed to update profile details.");
            }

        } catch (err) {
            const errorMessage = extractErrorMessage(err);
            setError(errorMessage || "An error occurred during profile update.");
        } finally {
            setIsUpdating(false);
        }
    };


    return (
        <div className="h-auto w-full flex mt-8 justify-center">

            {/* Success Modal */}
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
                <h2 className="text-center text-lg font-bold leading-tight">Update Profile Details</h2>
                <div className='text-right text-xl '>
                    <button onClick={() => setIsUpdateUserDetails(false)} className='hover:text-red-700 absolute top-24'>&#10008;</button>
                </div>

                {!currentUser && authStatus ? (
                    <div className="flex items-center justify-center gap-2 py-8">
                        <span className="loader w-5 h-5 border-2 border-t-transparent border-gray-500 rounded-full animate-spin"></span>
                        Loading profile data...
                    </div>
                ) : error && !currentUser ? (
                    <p className="text-red-600 mt-4 mb-2 text-center text-sm">{error}</p>
                ) : !currentUser && !authStatus ? (
                    <p className="text-center mt-4 mb-2">Please log in to update your profile.</p>
                ) : (
                    <form onSubmit={handleSubmit(updateDetails)}>
                        {error && <p className="text-red-600 mt-2 mb-1 text-center text-sm">{error}</p>}

                        <div className='grid grid-cols-2 gap-2 pt-4'>
                            {/* Other fields */}
                            <Input
                                label="First Name: "
                                labelClass='text-sm w-36'
                                placeholder="Enter Firstname"
                                className="text-xs p-1.5 w-full"
                                divClass=" gap-2 items-center"
                                {...register("firstname")}
                            />
                            <Input
                                label="Last Name: "
                                labelClass='text-sm w-36'
                                placeholder="Enter Lastname"
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
                                {...register("username")}
                            />
                            <Input
                                label="Email: "
                                labelClass='text-sm w-36'
                                placeholder="Enter email"
                                className="text-xs p-1.5 w-full"
                                divClass=" gap-2 items-center"
                                type="email"
                                {...register("email", {
                                    validate: {
                                        matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                            "Email address must be a valid address",
                                    }
                                })} />
                            <Input
                                label="CNIC: "
                                labelClass='text-sm w-36'
                                placeholder="Enter cnic"
                                className="text-xs p-1.5 w-full"
                                divClass=" gap-2 items-center"
                                {...register("cnic")}
                            />

                            {/* --- Dynamically rendered Mobile Number Inputs --- */}
                            <div className="col-span-2 flex flex-col gap-2">
                                <label className="text-sm w-36">Mobile Numbers:</label>
                                {fields.map((item, index) => (
                                    <div key={item.id} className="flex gap-2 items-center">
                                        <Input
                                        className="text-xs p-1.5 "
                                        divClass=" gap-2 items-center"
                                            placeholder={`Mobile Number ${index + 1}`}
                                            // Use register with the field array name and index
                                            {...register(`mobileno.${index}`, { // Registering as mobileno.0, mobileno.1, etc.
                                                // Add validation for each number if needed
                                                required: index === 0 ? "At least one mobile number is required" : false, // Make first one required
                                            })}
                                        />
                                        {/* Button to remove this mobile number input */}
                                        {fields.length > 1 && ( // Allow removing if there's more than one
                                            <button
                                                type="button" // Important: Prevent form submission
                                                onClick={() => remove(index)}
                                                className="text-red-500 hover:text-red-700 "
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {/* Button to add a new mobile number input */}
                                <button
                                    type="button" // Important: Prevent form submission
                                    onClick={() => append('')} // Append an empty string for a new input
                                    className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm w-36   "
                                >
                                    Add Mobile Number
                                </button>
                            </div>
                            {/* ------------------------------------------------- */}

                        </div>
                        <div
                            className="w-full flex justify-center pt-4"
                        >
                            {isUpdating ? (
                                <div className="flex items-center gap-2">
                                    <span className="loader w-4 h-4 border-2 border-t-transparent border-gray-500 rounded-full animate-spin"></span>
                                    Updating...
                                </div>
                            ) : (
                                <Button
                                    type="submit"
                                    className={`px-24 `}
                                    disabled={isUpdating}
                                >Update Details</Button>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default UpdateUserDetails;