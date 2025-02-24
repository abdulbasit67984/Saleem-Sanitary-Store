/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import Loader from '../pages/Loader'
import auth from '../features/auth'
import { setCurrentUser } from '../store/slices/auth/authSlice'

export default function Protected({children, authentication = true}) {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector(state => state.auth.status)


    // const currentUser = async () => {
    //     const response = await auth.getCurrentUser()
    //     if (response) {
    //         console.log(response)
    //         dispatch(setCurrentUser(response.data))
    //     }
    // }
    // useEffect(() => {
    //     currentUser()
    // }, [])


    const userData = useSelector(state => state.auth.userData)
    // console.log("userData", userData)
    
    const path = (userData?.BusinessId ? userData.BusinessId.businessName : userData?.username)?.replace(/ /g, '-') || 'user'

    useEffect(() => {
        //TODO: make it more easy to understand

        // if (authStatus ===true){
        //     navigate("/")
        // } else if (authStatus === false) {
        //     navigate("/login")
        // }
        //let authValue = authStatus === true ? true : false

        if(authentication && authStatus !== authentication){
            navigate("/login")
        } else if(!authentication && authStatus !== authentication){
            navigate(`/${path}/welcome-page`)
        }
        setLoader(false)
    }, [authStatus, navigate, authentication])

  return loader ? <Loader h_w='h-20 w-20 border-t-4 border-b-4'/> : <>{children}</>
}