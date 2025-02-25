/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin, setToken } from '../store/slices/auth/authSlice'
import { Button, Input, Logo, ForgotPassword } from "./index"
import { useDispatch, useSelector } from "react-redux"
import authService from "../features/auth"
import { useForm } from "react-hook-form"
import { setCurrentUser } from '../store/slices/auth/authSlice'

function Login() {

    const [isLoading, setIsLoading] = useState(false)
    const [isPasswordForgot, setIsPasswordForgot] = useState(false)
    const { authStatus, userData, token } = useSelector(state => state.auth)


    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState("")

    // console.log(authStatus);

    const login = async (data) => {
        setIsLoading(true)
        // console.log(data);
        setError("")
        try {

            const userDataRes = await authService.login(data)
            // console.log("user data in login component: ", userDataRes.user)
            if (userDataRes) {
                const user = userDataRes.user
                const resToken = userDataRes.accessToken
                // console.log("authstatus:", authStatus, "user:", user, "token:", resToken);
                dispatch(authLogin(user));
                dispatch(setCurrentUser(user));
                dispatch(setToken(resToken));
                // console.log("authstatus:", authStatus, "user:", userData, "token:", token);
                // console.log("username:", user.username);
                // console.log("business:", user.BusinessId?.businessName);
                const primaryPath = (user?.BusinessId ? user.BusinessId.businessName : user?.username)?.replace(/ /g, '-')
                // console.log("primaryPath:", primaryPath);
                const path = primaryPath ? primaryPath : "user"
                navigate(`/${path}/welcome-page`)
            }
        } catch (error) {
            const htmlString = error.response?.data;

            // Parse the HTML string into a DOM object
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, 'text/html');

            const preContent = doc.querySelector('pre').innerHTML.replace(/<br\s*\/?>/gi, '\n');

            // Extract only the first line (the error message)
            const errorMessage = preContent.split('\n')[0]; // Get the first line

            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return !isPasswordForgot ? (
        <div
            className=' h-auto mt-8 flex justify-center'
        >
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width='w-20 h-20' className='rounded-full opacity-90 hue-rotate-180' />
                    </span>
                </div>
                <h2 className="text-center text-xl font-bold leading-tight">Sign in to your account</h2>

                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                <form onSubmit={handleSubmit(login)} className='mt-8'>
                    <div className='space-y-5'>
                        <Input
                            label="Username: "
                            labelClass='text xs '
                            divClass='flex gap-3 items-center justify-center'
                            placeholder="Enter your Username"
                            className='px-4 py-2 text-xs'
                            type="text"
                            {...register("username", {
                                required: true
                            })}
                        />
                        <Input
                            label="Password: "
                            type="password"
                            labelClass='text xs'
                            divClass='flex gap-3 items-center justify-center'
                            className='px-4 py-2 text-xs'
                            placeholder="Enter your password"
                            {...register("password", {
                                required: true,
                            })}
                        />

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
                                >Sign in</Button>

                            )}
                        </button>
                    </div>
                </form>
                <p className="text-center text-sm font-thin pt-4">
                    <button onClick={() => setIsPasswordForgot(true)}>Forgot password</button>
                </p>
            </div>
        </div>
    ) :
        <ForgotPassword data={setIsPasswordForgot} />
}

export default Login