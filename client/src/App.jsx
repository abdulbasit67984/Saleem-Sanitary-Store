/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import { jwtDecode  } from 'jwt-decode';
import authService from "./features/auth"
import { login, logout, setCurrentUser } from "./store/slices/auth/authSlice"
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'
import { useParams, useNavigate } from 'react-router-dom'
import Loader from './pages/Loader'

function App() {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // const token = useSelector(state => state.auth.token)
  // console.log(token);
  
  

  useEffect(() => {
    const token = authService.getAccessToken();

    if (token) {
      try {
        const decodedToken = jwtDecode (token);
        // console.log("decoded token: " , decodedToken);
        dispatch(setCurrentUser(decodedToken));
        const primaryPath = (decodedToken?.BusinessId ? decodedToken.BusinessId.businessName : decodedToken?.username)?.replace(/ /g, '-')
        const path = primaryPath ? primaryPath : "user"
        navigate(`/${path}/welcome-page`);

      } catch (error) {
        console.error("Invalid token", error);
        dispatch(logout());
      }
    } else {
      dispatch(logout());
    }
    
    setLoading(false);
  }, []);
  

  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between main'>
      <div className='w-full block'>
        <Header />
        <main >
          <Outlet />
        </main>
      </div>
    </div>
  ) : <Loader message="Loading User Data Please Wait...."  h_w="h-20 w-20 border-t-4 border-b-4"/>
}

export default App