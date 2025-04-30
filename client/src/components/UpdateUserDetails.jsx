/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import authService from '../features/auth.js'; // Assuming authService is your API service
import { useNavigate } from 'react-router-dom';
import { Button, Input } from './index.js'; // Assuming Button and Input components exist
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { extractErrorMessage } from '../utils/extractErrorMessage.js'; // Utility for error parsing
import { setCurrentUser } from '../store/slices/auth/authSlice.js'; // Action to update user data in Redux

function UpdateUserDetails({setIsUpdateUserDetails}) {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isUpdating, setIsUpdating] = useState(false); // State specifically for update submission
    const [responseMessage, setResponseMessage] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const dispatch = useDispatch();
    // Get the current user data from the Redux store
    const currentUser = useSelector(state => state.auth.userData);
    const authStatus = useSelector(state => state.auth.status);


    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        // Set default values using data from Redux, fallback to empty strings
        defaultValues: {
            username: currentUser?.username || '',
            firstname: currentUser?.firstname || '',
            lastname: currentUser?.lastname || '',
            email: currentUser?.email || '',
            mobileno: currentUser?.mobileno || '',
            cnic: currentUser?.cnic || '',
            // Password field is NOT included in the general update form
        }
    });

    // Effect to reset the form whenever currentUser data changes
    // This pre-fills the form when the component mounts and data is available,
    // and also updates the form if the user data is refetched or changes externally.
    useEffect(() => {
        // Ensure currentUser is not null before resetting
        if (currentUser) {
            reset({
                username: currentUser.username || '',
                firstname: currentUser.firstname || '',
                lastname: currentUser.lastname || '',
                email: currentUser.email || '',
                mobileno: currentUser.mobileno || '',
                cnic: currentUser.cnic || '',
            });
        }
    }, [currentUser, reset]); // Depend on currentUser and reset function from useForm

    // Optional: Redirect if user is not logged in
     useEffect(() => {
         if (!authStatus) {
             // Redirect to login or homepage if not authenticated
             // navigate('/login'); // Or wherever appropriate
         }
     }, [authStatus, navigate]);


    const updateDetails = async (data) => {
        setIsUpdating(true);
        setError("");
        setResponseMessage("");

        try {
            // The backend controller expects JSON for user details update (no file upload here)
            // Pass the data object directly to the service function
            const response = await authService.updateUserDetails(data);

            if (response && response.statusCode === 200) {
                setResponseMessage(response.message || "Profile updated successfully!");
                setShowSuccessModal(true);

                // **IMPORTANT:** Update the user data in the Redux store
                if (response.data) {
                     dispatch(setCurrentUser(response.data)); // Dispatch the updated user data
                     // localStorage is updated by the Redux reducer (setCurrentUser)
                }

                // No reset() here, as we want the form to show the newly updated values
                // which are now in currentUser thanks to the dispatch above.

            } else {
                 // Use extractErrorMessage for non-200 API responses as well
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

                 {/* Show loading state while Redux data might be populating initially */}
                 {!currentUser && authStatus ? (
                     <div className="flex items-center justify-center gap-2 py-8">
                         <span className="loader w-5 h-5 border-2 border-t-transparent border-gray-500 rounded-full animate-spin"></span>
                         Loading profile data...
                     </div>
                 ) : error && !currentUser ? (
                     // Handle case where user is authenticated but data couldn't be loaded or there's an error
                     <p className="text-red-600 mt-4 mb-2 text-center text-sm">{error}</p>
                 ) : !currentUser && !authStatus ? (
                      // Handle case where user is not authenticated (if not redirecting)
                      <p className="text-center mt-4 mb-2">Please log in to update your profile.</p>
                 ) : (
                    // Render the form only if currentUser data is available
                    <form onSubmit={handleSubmit(updateDetails)}>
                        {error && <p className="text-red-600 mt-2 mb-1 text-center text-sm">{error}</p>}

                        <div className='grid grid-cols-2 gap-2 pt-4'>
                             {/* Input fields for user details */}
                             {/* Note: Password update should be a separate form/feature */}
                            <Input
                                label="First Name: "
                                labelClass='text-sm w-36'
                                placeholder="Enter First Name"
                                className="text-xs p-1.5 w-full"
                                divClass=" gap-2 items-center"
                                {...register("firstname", {
                                    // Optional: Add validation rules if needed
                                })}
                            />
                            <Input
                                label="Last Name: "
                                labelClass='text-sm w-36'
                                placeholder="Enter Last Name"
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
                                {...register("username", {
                                    // Optional: Add validation rules if needed
                                })}
                            />
                            <Input
                                label="Email: "
                                labelClass='text-sm w-36'
                                placeholder="Enter your email"
                                type="email"
                                className="text-xs p-1.5 w-full"
                                divClass=" gap-2 items-center"
                                {...register("email", {
                                    // Optional: Add validation rules (copying from Signup is fine)
                                    validate: {
                                         matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                              "Email address must be a valid address",
                                     }
                                })}
                            />
                            <Input
                                label="CNIC: "
                                placeholder="Enter your CNIC"
                                labelClass='text-sm w-36'
                                className="text-xs p-1.5 w-full"
                                divClass=" gap-2 items-center"
                                {...register("cnic", {
                                     // Optional: Add validation rules
                                })}
                            />
                            <Input
                                label="Mobile No: "
                                placeholder="Enter Mobile No"
                                labelClass='text-sm w-36'
                                className="text-xs p-1.5 w-full"
                                divClass=" gap-2 items-center"
                                {...register("mobileno", {
                                    // Optional: Add validation rules
                                })}
                            />

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
                                    disabled={isUpdating} // Disable button while updating
                                >Update Details</Button>
                            )}
                        </div>
                    </form>
                 )} {/* End conditional rendering based on currentUser */}
            </div>
        </div>
    );
}

export default UpdateUserDetails;