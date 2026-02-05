/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import authService from '../features/auth.js'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../store/slices/auth/authSlice.js'
import { Button, Input, Logo } from './index.js'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import UpdateBusiness from './UpdateBusiness.jsx'
import { showSuccessToast, showErrorToast } from '../utils/toast'

function RegisterBusiness() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState("")
    const [response, setResponse] = useState("")
    const [isStoreCreated, setIsStoreCreated] = useState(false)
    const [isBusinessUpdate, setisBusinessUpdate] = useState(false)


    const dispatch = useDispatch()
    const { register, handleSubmit, watch, reset } = useForm()
    const { authStatus, userData, token } = useSelector(state => state.auth)

    // console.log("authstatus:", authStatus, "user:", userData, "token:", token);


    const create = async (data) => {
        setIsLoading(true)
        setError("")
        try {
            // console.log(data);

            const reponse = await authService.registerBusiness(data)
            // console.log(Response)
            if (reponse) {
                setResponse(reponse)
                setIsStoreCreated(true)
                showSuccessToast(reponse || 'Business registered successfully!')
                setIsLoading(false)
            }

        } catch (error) {
            const htmlString = error.response.data;

            // Parse the HTML string into a DOM object
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, 'text/html');

            const preContent = doc.querySelector('pre').innerHTML.replace(/<br\s*\/?>/gi, '\n');

            // Extract only the first line (the error message)
            const errorMessage = preContent.split('\n')[0]; // Get the first line

            setError(errorMessage)
            showErrorToast(errorMessage)
        } finally {
            setIsLoading(false)
            reset()
        }
    }


    return ( isBusinessUpdate ?
        <UpdateBusiness setisBusinessUpdate={setisBusinessUpdate} />
        :
        <div className="h-auto w-full flex mt-8 justify-center">

            {isStoreCreated && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                    <div className="bg-white p-6 rounded shadow-lg text-center relative">
                        <span className='absolute top-0 pt-1 right-2'>
                            <button className='hover:text-red-700' onClick={() => setIsStoreCreated(false)}>&#10008;</button>
                        </span>
                        <h2 className="text-lg font-thin p-4">{response}</h2>
                    </div>
                </div>
            )}

            <div className="w-4/6 bg-gray-100 rounded-lg p-6 border border-gray-300">
                <h2 className="text-center text-lg font-bold leading-tight">Register Business</h2>


                {error && <p className="text-red-600 mt-2 mb-1 text-center text-sm">{error}</p>}

                <form onSubmit={handleSubmit(create)}>
                    <div className='grid grid-cols-2 gap-2 pt-4'>

                        {/* <Input
                            label="Owner: "
                            placeholder="Enter Name"
                            labelClass='text-sm w-36'
                            className="text-xs p-1.5 w-full"
                            divClass="flex gap-2 items-center"
                            {...register("owner", {
                                required: true,
                            })}
                        /> */}


                        <Input
                            label="Business Name: "
                            placeholder="Enter your Business Name"
                            labelClass='text-sm w-36'
                            className="text-xs p-1.5 w-full"
                            divClass=" gap-2 items-center"
                            // {...register("businessName", {
                            //     required: true,
                            // })}
                        />

                        <Input
                            label="Business Region: "
                            placeholder="Enter your Business Region"
                            labelClass='text-sm w-36'
                            className="text-xs p-1.5 w-full"
                            divClass=" gap-2 items-center"
                            // {...register("businessRegion", {
                            //     required: true,
                            // })}
                        />
                        <Input
                            label="Subscription: "
                            placeholder="Enter Subscription Plan"
                            labelClass='text-sm w-36'
                            className="text-xs p-1.5 w-full"
                            divClass=" gap-2 items-center"
                            // {...register("subscription", {
                            //     required: true,
                            // })}
                        />
                        <Input
                            label="Exempted Paragraph(if any): "
                            placeholder="Enter your Business Exempted Paragraph"
                            labelClass='text-sm w-full'
                            className="text-xs p-1.5 w-full"
                            divClass=" gap-2 items-center"
                            // {...register("exemptedParagraph")}
                        />
                        <Input
                            label="GST Amount: (if any)"
                            placeholder="Enter GST Amount"
                            className="text-xs p-1.5 w-full"
                            divClass=" gap-2 items-center"
                            labelClass='text-sm w-36'
                            type='number'
                            // {...register("gst")}
                        />
                        <Input
                            label="Logo"
                            placeholder="Enter Business Logo"
                            className="text-xs p-1.5 w-full"
                            divClass=" gap-2 items-center"
                            labelClass='text-sm w-36'
                            type='file'
                            // {...register("businessLogo")}
                        />

                    </div>
                    <div
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
                            >Create Account</Button>

                        )}
                    </div>
                </form>
                <p className='text-center py-3'>
                    <button
                        className='text-blue-700'
                        onClick={() => setisBusinessUpdate(true)}
                    >Update </button>
                    <span> Business details</span>
                </p>
            </div>
        </div>
    )
}

export default RegisterBusiness;
