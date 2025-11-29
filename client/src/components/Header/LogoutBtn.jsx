/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import authService from '../../features/auth'
import { logout } from '../../store/slices/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, X, CheckCircle } from 'lucide-react'

function LogoutBtn() {
  const [isLoggedOut, setIsLoggedOut] = useState(false)
  const [response, setResponse] = useState(null)

  const dispatch = useDispatch()
  const navigate = useNavigate()

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
      {/* Logout Button */}
      <motion.button
        // whileHover={{ scale: 1 }}
        whileTap={{ scale: 0.95 }}
        className='flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primaryHover text-white text-sm font-semibold rounded-xl shadow-lg transition-all duration-300 cursor-pointer relative z-10'
        onClick={logoutHandler}
        type="button"
      >
        <motion.div
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.3 }}
        >
          <LogOut className="w-4 h-4" />
        </motion.div>
        <span>Logout</span>
      </motion.button>
    </>
  )
}

export default LogoutBtn