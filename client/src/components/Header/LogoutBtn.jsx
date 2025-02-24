/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import authService from '../../features/auth'
import { logout } from '../../store/slices/auth/authSlice'
import { useNavigate } from 'react-router-dom'

function LogoutBtn() {
  const [isLoggedOut, setIsLoggedOut] = useState(false)
  const [response, setResponse] = useState(null)

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      const res = await authService.logout()
  
      if (res) {
        setIsLoggedOut(true)
        setResponse(res)
      }
      if (res && isLoggedOut !== true) {
        dispatch(logout())
        navigate('/login')
      }
    } catch (error) {
      console.error("logout error: ", error)
    } 
  }
  return (
    <>
      {isLoggedOut && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded shadow-lg text-center relative">
            <span className='absolute top-0 pt-1 right-2'>
              <button className='hover:text-red-700' onClick={() => setIsLoggedOut(false)}>&#10008;</button>
            </span>
            <h2 className="text-lg font-thin p-4">{response.message}</h2>
          </div>
        </div>
      )}
      <button
        className='inline-bock text-sm px-4 py-2 duration-200 hover:bg-blue-100 rounded-full'
        onClick={logoutHandler}
      >Logout</button>
    </>
  )
}

export default LogoutBtn