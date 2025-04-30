/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import authService from '../features/auth.js'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../store/slices/auth/authSlice.js'
import { Button, Input, Logo } from './index.js'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { extractErrorMessage } from '../utils/extractErrorMessage.js'
import UpdateUserDetails from './UpdateUserDetails.jsx'

function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [response, setResponse] = useState("")
    const [isAccountCreated, setIsAccountCreated] = useState(false)
    const [isUpdateUserDetails, setIsUpdateUserDetails] = useState(false)


    const dispatch = useDispatch()
    const { register, handleSubmit, watch, reset } = useForm()

    const create = async (data) => {
        setIsLoading(true)
        setError("")
        try {
            // console.log(data);

            const reponse = await authService.createAccount(data)
            // console.log(Response)
            if (reponse) {
                setResponse(reponse)
                setIsAccountCreated(true)
            }
            
        } catch (error) {
            const errorMessage = extractErrorMessage(error)
            setError(errorMessage)
        } finally {
            reset()
            setIsLoading(false)
        }
    }


    return (
        isUpdateUserDetails ?
        <UpdateUserDetails setIsUpdateUserDetails={setIsUpdateUserDetails} />
        :
        <div className="h-auto w-full flex mt-8 justify-center">

            {isAccountCreated && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                    <div className="bg-white p-6 rounded shadow-lg text-center relative">
                        <span className='absolute top-0 pt-1 right-2'>
                            <button className='hover:text-red-700' onClick={() => setIsAccountCreated(false)}>&#10008;</button>
                        </span>
                        <h2 className="text-lg font-thin p-4">{response}</h2>
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
                        <Input
                            label="First Name: "
                            labelClass='text-sm w-36'
                            placeholder="Enter First Name"
                            className="text-xs p-1.5 w-full"
                            divClass=" gap-2 items-center"
                            {...register("firstname", {
                                required: true,
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
                                required: true,
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
                                validate: {
                                    matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address",
                                }
                            })}
                        />
                        <Input
                            label="Password: "
                            type="password"
                            labelClass='text-sm w-36'
                            placeholder="Enter your password"
                            className="text-xs p-1.5 w-full"
                            divClass=" gap-2 items-center"
                            {...register("password", {
                                required: true,
                            })}
                        />

                        <Input
                            label="CNIC: "
                            placeholder="Enter your CNIC"
                            labelClass='text-sm w-36'
                            className="text-xs p-1.5 w-full"
                            divClass=" gap-2 items-center"
                            {...register("cnic", {
                            })}
                        />
                        <Input
                            label="Mobile No: "
                            placeholder="Enter Mobile No"
                            labelClass='text-sm w-36'
                            className="text-xs p-1.5 w-full"
                            divClass=" gap-2 items-center"
                            {...register("mobileno", {
                            })}
                        />
                        
                    </div>
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
                            >Create Account</Button>

                        )}
                    </button>
                </form>
                <p className='text-center py-3'>
                    <button
                        className='text-blue-700'
                        onClick={() => setIsUpdateUserDetails(true)}
                    >Update </button>
                    <span> Account details</span>
                </p>
            </div>
        </div>
    )
}

export default Signup;
