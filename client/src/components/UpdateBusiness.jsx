/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import authService from '../features/auth.js'; // Assuming this service handles API calls
import { useNavigate } from 'react-router-dom';
import { Button, Input, Logo } from './index.js'; // Assuming these components exist
import { useDispatch, useSelector } from 'react-redux'; // Assuming Redux is used for auth state
import { useForm } from 'react-hook-form';

function UpdateBusiness({setisBusinessUpdate}) {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true); // Start loading as we need to fetch data
    const [isUpdating, setIsUpdating] = useState(false); // State specifically for update submission
    const [responseMessage, setResponseMessage] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [businessData, setBusinessData] = useState(null); // State to store fetched business data

    const dispatch = useDispatch(); // Not directly used here based on the Register component, but keep if needed elsewhere
    const { authStatus, userData, token } = useSelector(state => state.auth); // Assuming auth state is in Redux

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        // Set default values once businessData is fetched
        defaultValues: {
            businessName: '',
            businessRegion: '',
            subscription: '',
            exemptedParagraph: '',
            gst: '',
            // businessLogo is handled separately via file input and display
        }
    });

    // Effect to fetch business details on component mount
    useEffect(() => {
        const fetchBusinessDetails = async () => {
            setIsLoading(true);
            setError("");
            try {
                // Assume authService has a method to get the current user's business
                const response = await authService.getBusinessDetails();
                if (response && response.statusCode === 200 && response.data) {
                    setBusinessData(response.data);
                    console.log('response.data', response.data)
                    // Use reset to pre-populate the form fields with fetched data
                    reset({
                        businessName: response.data.businessName || '',
                        businessRegion: response.data.businessRegion || '',
                        subscription: response.data.subscription || '',
                        exemptedParagraph: response.data.exemptedParagraph || '',
                        gst: response.data.gst || '',
                        // File input cannot be pre-filled this way
                    });
                } else {
                    // Handle cases where the user has no business or fetch failed
                    setError(response?.message || "Could not fetch business details.");
                }
            } catch (err) {
                const htmlString = err.response.data; // Reusing error parsing from Register component
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlString, 'text/html');
                const preContent = doc.querySelector('pre')?.innerHTML.replace(/<br\s*\/?>/gi, '\n') || err.message;
                const errorMessage = preContent.split('\n')[0];
                setError(errorMessage || "Error fetching business details.");
            } finally {
                setIsLoading(false);
            }
        };

        // Only fetch if user is authenticated (optional check, routing might handle this)
        fetchBusinessDetails();

    }, [authStatus, reset]); // Depend on authStatus and reset function


    const updateDetails = async (data) => {
        setIsUpdating(true);
        setError("");
        setResponseMessage("");

        try {
            const formData = new FormData();

            // Append all text fields from the form
            formData.append("businessName", data.businessName);
            formData.append("businessRegion", data.businessRegion);
            formData.append("subscription", data.subscription);
            formData.append("exemptedParagraph", data.exemptedParagraph || ""); // Send empty string if null/undefined
            formData.append("gst", data.gst || ""); // Send empty string if null/undefined

            // Handle the logo file upload
            // data.businessLogo is a FileList from the file input
            if (data.businessLogo && data.businessLogo[0]) {
                formData.append("businessLogo", data.businessLogo[0]);
            }
            // Note: If no new file is selected, businessLogo[0] will be undefined,
            // and the FormData will not contain the 'businessLogo' field.
            // The backend should be designed to handle this (i.e., keep the old logo if the field is missing).

            // Assume authService has a method to update the business
            console.log('formData', formData)
            const response = await authService.updateBusinessDetails(formData);

            if (response && response.statusCode === 200) {
                setResponseMessage(response.message || "Business details updated successfully!");
                setShowSuccessModal(true);
                // Optionally update local state or refetch data after successful update
                // setBusinessData(response.data); // If response returns the updated data
            } else {
                setError(response?.message || "Failed to update business details.");
            }

        } catch (err) {
            // Reusing error parsing logic
            const htmlString = err.response.data;
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, 'text/html');
            const preContent = doc.querySelector('pre')?.innerHTML.replace(/<br\s*\/?>/gi, '\n') || err.message;
            const errorMessage = preContent.split('\n')[0];
            setError(errorMessage || "An error occurred during update.");
        } finally {
            setIsUpdating(false);
            // No reset here, as we want to keep the updated values in the form after success
            // reset(); // Uncomment this line if you want to clear the form after update
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
                <h2 className="text-center text-lg font-bold leading-tight">Update Business Details</h2>
                <div className='text-right text-xl '>
                    <button onClick={() => setisBusinessUpdate(false)} className='hover:text-red-700 absolute top-24'>&#10008;</button>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center gap-2 py-8">
                        <span className="loader w-5 h-5 border-2 border-t-transparent border-gray-500 rounded-full animate-spin"></span>
                        Loading Business Details...
                    </div>
                ) : error && !businessData ? (
                    <p className="text-red-600 mt-4 mb-2 text-center text-sm">{error}</p>
                ) : !businessData ? (
                    <p className="text-center mt-4 mb-2">No business details found.</p>
                ) : (
                    <form onSubmit={handleSubmit(updateDetails)}>
                        {error && <p className="text-red-600 mt-2 mb-1 text-center text-sm">{error}</p>}

                        <div className='grid grid-cols-2 gap-2 pt-4'>

                            {/* Existing Logo Display */}
                            {businessData.businessLogo && (
                                <div className="col-span-2 flex flex-col items-center mb-4">
                                    <label className="text-sm w-36 text-center mb-2">Current Logo:</label>
                                    <img
                                        src={businessData.businessLogo}
                                        alt="Current Business Logo"
                                        className="h-24 w-auto object-contain rounded"
                                    />
                                </div>
                            )}

                            <Input
                                label="Business Name: "
                                placeholder="Enter your Business Name"
                                labelClass='text-sm w-36'
                                className="text-xs p-1.5 w-full"
                                divClass=" gap-2 items-center"
                                {...register("businessName", {
                                    // Add validation rules if needed, e.g., minLength, maxLength
                                })}
                            />

                            <Input
                                label="Business Region: "
                                placeholder="Enter your Business Region"
                                labelClass='text-sm w-36'
                                className="text-xs p-1.5 w-full"
                                divClass=" gap-2 items-center"
                                {...register("businessRegion", {
                                    // Add validation rules if needed
                                })}
                            />
                            <Input
                                label="Subscription: "
                                placeholder="Enter Subscription Plan"
                                labelClass='text-sm w-36'
                                className="text-xs p-1.5 w-full"
                                divClass=" gap-2 items-center"
                                {...register("subscription", {
                                    // Add validation rules if needed
                                })}
                            />
                            <Input
                                label="Exempted Paragraph(if any): "
                                placeholder="Enter your Business Exempted Paragraph"
                                labelClass='text-sm w-full'
                                className="text-xs p-1.5 w-full"
                                divClass=" gap-2 items-center"
                                {...register("exemptedParagraph")}
                            />
                            <Input
                                label="GST Amount: (if any)"
                                placeholder="Enter GST Amount"
                                className="text-xs p-1.5 w-full"
                                divClass=" gap-2 items-center"
                                labelClass='text-sm w-36'
                                type='number'
                                {...register("gst")}
                            />
                            <Input
                                label="Update Logo: " // Changed label to indicate update
                                className="text-xs p-1.5 w-full"
                                divClass=" gap-2 items-center"
                                labelClass='text-sm w-36'
                                type='file'
                                accept="image/*" // Suggest image file types
                                {...register("businessLogo")}
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
                                    disabled={isLoading || isUpdating} // Disable button while fetching or updating
                                >Update Details</Button>

                            )}
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default UpdateBusiness;