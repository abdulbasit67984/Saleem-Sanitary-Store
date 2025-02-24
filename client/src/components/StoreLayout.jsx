import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import authService from "../features/auth"
import { setCurrentUser } from '../store/slices/auth/authSlice'
import { useDispatch } from "react-redux";


const StoreLayout = () => {
    // Get current user data using the authService's method (e.g., authService.getCurrentUser())

    // const dispatch = useDispatch()

    // const currentUser = async () => {
    //     try {
    //         const user = await authService.getCurrentUser();
    //         if (user) {
    //             console.log(`User ${user.data}`)
    //             dispatch(setCurrentUser(user.data));
    //         }
    //     } catch (error) {
    //         console.log(error);
            
    //     }
    // }

    // useEffect(()=> {
    //     currentUser()
    // },[])

    return (
        <div>
            <Outlet />
        </div>
    );
};

export default StoreLayout;
