/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import authService from '../features/auth.js'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../store/slices/auth/authSlice.js'
import { Button, Input, Logo } from './index.js'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'

function AddRole() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState("")
    const [response, setResponse] = useState("")
    const [roles, setRoles] = useState([])
    const [isRoleAdded, setIsRoleAdded] = useState(false)
    const dispatch = useDispatch()
    const { register, handleSubmit, watch, reset } = useForm()
    const { authStatus, userData, token } = useSelector(state => state.auth)

    // console.log("authstatus:", authStatus, "user:", userData, "token:", token);


    const createRole = async (data) => {
        setIsLoading(true)
        setError("")
        try {
            // console.log(data);

            const reponse = await authService.registerRole(data)
            // console.log(Response)
            if (reponse) {
                setResponse(reponse)
                setIsRoleAdded(true)
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
        } finally {
            reset()
            setIsLoading(false)
        }
    }

    const getRoles = async () => {
        setIsLoading(true)
        setError("")
        try {
            const response = await authService.getRoles()
            // console.log(response)
            if (response.data) {
                setRoles(response.data)
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getRoles()
        // console.log("useEffect called")
    }, [response])


    return (
        <div className="h-auto w-full mt-8">

            {isRoleAdded && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                    <div className="bg-white p-6 rounded shadow-lg text-center relative">
                        <span className='absolute top-0 pt-1 right-2'>
                            <button className='hover:text-red-700' onClick={() => setIsRoleAdded(false)}>&#10008;</button>
                        </span>
                        <h2 className="text-lg font-thin p-4">{response}</h2>
                    </div>
                </div>
            )}

            <div className='flex justify-center'>
                <div className="w-3/6 bg-gray-100 rounded-lg p-6 border border-gray-300">
                    <h2 className="text-center text-lg font-bold leading-tight">Add Role</h2>

                    {error && <p className="text-red-600 mt-2 mb-1 text-center text-sm">{error}</p>}

                    <form onSubmit={handleSubmit(createRole)}>
                        <div className='grid  gap-2 pt-4'>



                            <Input
                                label="Role Name: "
                                placeholder="Enter your Business Name"
                                labelClass='text-sm w-36'
                                className="text-xs p-1.5 w-full"
                                divClass=" gap-2 items-center"
                                {...register("businessRoleName", {
                                    required: true,
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
                                >Create Role</Button>

                            )}
                        </button>

                    </form>
                </div>
            </div>

            <div className=' w-full flex justify-center'>
                <div className="w-3/6 bg-gray-100 rounded-lg p-6 border border-gray-300 max-h-72 overflow-auto scrollbar-thin">
                    <table className='w-full text-xs'>
                        <thead className='bg-gray-300 py-2'>
                            <tr className='py-5 bg-gray-300'>
                                <th className='py-1'>Role ID</th>
                                <th>Role Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((role, index) => (
                                <tr key={index}>
                                    <td className='text-center py-2'>{index + 1}</td>
                                    <td className='text-center'>{role.businessRoleName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AddRole;
