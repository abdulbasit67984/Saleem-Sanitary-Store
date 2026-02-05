/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import '../styling/WelcomeCSS.css';
import MagicUiAnimation from "../components/magicUI/MagicUiAnimation";
import Loader from "./Loader";
import { useSelector, useDispatch } from "react-redux";
import config from '../features/config'
import { useNavigate } from "react-router-dom";
import {
    setAllProducts
} from '../store/slices/products/productsSlice'
import { setCustomerData } from '../store/slices/customer/customerSlice'
import { setCompanyData } from '../store/slices/company/companySlice'
import { setSupplierData } from '../store/slices/supplier/supplierSlice'
import { setCategoryData } from '../store/slices/products/categorySlice'
import { setTypeData } from '../store/slices/products/typeSlice'
import authService from "../features/auth";
import { logout } from "../store/slices/auth/authSlice";
import { setCurrentUser, setPrimayPath } from '../store/slices/auth/authSlice'
import { showSuccessToast, showErrorToast } from '../utils/toast';


function WelcomePage() {

    const [error, setError] = useState(null)
    const [successMessage, setSuccessMessage] = useState("")
    const [loading, setLoading] = useState(true)

    // const allProducts = useSelector(state => state.saleItems.allProducts)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // authService.startTokenRefreshTimer();

    const fetchAllProducts = async () => {
        setError("")
        try {
            const allProductsBefore = await config.fetchAllProducts()
            if (allProductsBefore) {
                console.log('all products', allProductsBefore)
                dispatch(setAllProducts(allProductsBefore.data));
                setError('')
            }
        } catch (error) {
            // console.log("products error: ", error.response.status)
            setError(error)
            if (error?.response.status === 401) {
                dispatch(logout())
                navigate('/login')
            }
        }
        //  finally {
        //     if(error?.response.status === 401) {
        //         navigate('/login')
        //     }
        // }


    }

    const fetchAllCustomers = async () => {
        setError("")
        try {
            const allCustomersBefore = await config.fetchAllCustomers()
            if (allCustomersBefore) {
                dispatch(setCustomerData(allCustomersBefore.data));
                setError('')
                console.log(allCustomersBefore)
            }
            // setSuccessMessage("Data Loaded Successfully...")
        } catch (error) {
            setError(error.message)
        }

    }

    const fetchAllCompanies = async () => {
        setError("")
        try {
            const allCustomersBefore = await config.fetchAllCompanies()
            if (allCustomersBefore) {
                dispatch(setCompanyData(allCustomersBefore.data));
                setError('')
                console.log(allCustomersBefore)
            }
        } catch (error) {
            setError(error.message)
        }
        // finally {
        //     if(error?.response.status === 401) {
        //         navigate('/login')
        //     }
        // }


    }

    const fetchAllSuppliers = async () => {
        setError("")
        try {
            const allCustomersBefore = await config.fetchAllSuppliers()
            if (allCustomersBefore) {
                dispatch(setSupplierData(allCustomersBefore.data));
                setError('')
                console.log(allCustomersBefore)
            }
        } catch (error) {
            setError(error.message)
        }
        // finally {
        //     if(error?.response.status === 401) {
        //         navigate('/login')
        //     }
        // }


    }

    const fetchAllCategories = async () => {
        setError("")
        try {
            const response = await config.fetchAllCategories()
            if (response) {
                dispatch(setCategoryData(response.data));
                setError('')
                console.log("categories: ", response)
            }
        } catch (error) {
            setError(error.message)
        }
        // finally {
        //     if(error?.response.status === 401) {
        //         navigate('/login')
        //     }
        // }


    }

    const fetchAllTypes = async () => {
        setError("")
        try {
            const response = await config.fetchAllTypes()
            if (response) {
                dispatch(setTypeData(response.data));
                setError('')
                console.log("types: ", response)
            }
            setSuccessMessage("Data Loaded Successfully...")
            showSuccessToast("Data loaded successfully!")
        } catch (error) {
            setError(error.message)
            showErrorToast(error.message || 'Failed to load data')
            if (error?.response.status === 401) {
                navigate('/login')
            }
        }


    }

    // const fetchUserData = async () => {
    //     const response = await authService.getCurrentUser()
    //     if (response) {
    //         console.log("welcome page userdata: ", response.data);
    //         dispatch(setPrimayPath((response.data?.BusinessId ? response.data.BusinessId.businessName : response.data?.username)?.replace(/ /g, '-')))
    //         dispatch(setCurrentUser(response.data))
    //     }


    // }

    useEffect(() => {
        // fetchUserData();
        setSuccessMessage('')
        fetchAllProducts();
        fetchAllCustomers();
        fetchAllCompanies();
        fetchAllSuppliers();
        fetchAllCategories();
        fetchAllTypes();
        setLoading(false);


        setTimeout(() => {
            setSuccessMessage('')
        }, 5000);

    }, [])

    return (
        <>
            <MagicUiAnimation />
            {loading && <Loader message="Loading Data Please Wait...." mt="mt-28" h_w="h-10 w-10 border-t-2 border-b-2" />}

            {successMessage && <p className="absolute text-green-600 top-[30rem] w-screen text-center">{successMessage}</p>}
        </>

    );
}

export default WelcomePage;
