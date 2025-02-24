/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { Button, Input, Logo } from "./index"
import authService from "../features/auth"
import { extractErrorMessage } from '../utils/extractErrorMessage'

function ForgotPassword(props) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    const { register, handleSubmit } = useForm()

    const changePassword = async (data) => {
        setIsLoading(true)
        setError("")

        if (data.newPassword !== data.confirmPassword) {
            setError("New Password not matched")
            setIsLoading(false)
            return
        }

        try {
            const response = await authService.forgotPassword({
                username: data.username,
                cnic: data.cnic,
                newPassword: data.newPassword
            });

            if (response) {
                setMessage(response.message);
                props.data(false);
            }
        } catch (error) {
            const errorMessage = extractErrorMessage(error)
            setError(errorMessage|| "Something went wrong");
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='h-auto mt-8 flex justify-center'>
            {message && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                    <div className="bg-white p-6 rounded shadow-lg text-center relative">
                        <span className='absolute top-0 pt-1 right-2'>
                            <button className='hover:text-red-700' onClick={() => setMessage("")}>&#10008;</button>
                        </span>
                        <h2 className="text-lg font-thin p-4">{message}</h2>
                    </div>
                </div>
            )}

            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <div className='flex justify-end'>
                    <button className='hover:text-red-700 text-xl' onClick={() => props.data(false)}>&#10008;</button>
                </div>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width='w-20 h-20' className='rounded-full opacity-90 hue-rotate-180' />
                    </span>
                </div>
                <h2 className="text-center text-xl font-bold leading-tight">Reset Your Password</h2>

                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

                <form onSubmit={handleSubmit(changePassword)} className='mt-8'>
                    <div className='space-y-5'>
                        <Input
                            label="Username: "
                            labelClass='text xs w-28'
                            divClass='flex gap-3 items-center justify-center'
                            placeholder="Enter your username"
                            className='px-4 py-2 text-xs'
                            type="text"
                            {...register("username", { required: true })}
                        />
                        <Input
                            label="CNIC: "
                            labelClass='text xs w-28'
                            divClass='flex gap-3 items-center justify-center'
                            placeholder="Enter your CNIC"
                            className='px-4 py-2 text-xs'
                            type="text"
                            {...register("cnic", { required: true })}
                        />
                        <Input
                            label="New Password: "
                            type="password"
                            labelClass='text xs w-28'
                            divClass='flex gap-3 items-center justify-center'
                            className='px-4 py-2 text-xs'
                            placeholder="Enter your new password"
                            {...register("newPassword", { required: true })}
                        />
                        <Input
                            label="Confirm Password:"
                            labelClass='text xs w-28'
                            divClass='flex gap-3 items-center justify-center'
                            placeholder="Enter password again to confirm"
                            className='px-4 py-2 text-xs'
                            type="password"
                            {...register("confirmPassword", { required: true })}
                        />

                        <div className='w-full flex justify-center'>
                            <button disabled={isLoading}>
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <span className="loader w-4 h-4 border-2 border-t-transparent border-gray-500 rounded-full animate-spin"></span>
                                        Loading...
                                    </div>
                                ) : (
                                    <Button type="submit" className={`px-24 `}>Change Password</Button>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword;
