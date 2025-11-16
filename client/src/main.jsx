import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home.jsx'
import {
AuthLayout,
Login,
Signup,
Dashboard,
RegisterBusiness,
ForgotPassword,
AddRole
}
  from './components/index.js'
import Loader from './pages/Loader.jsx'
import WelcomePage from './pages/WelcomePage.jsx'
import BillPayment from './components/homePageComponents/sales/bills/BillPayment.jsx'
import StoreLayout from './components/StoreLayout.jsx'
import WhatsAppSettings from './pages/WhatsappSettings.jsx'


const router = createBrowserRouter([

  {
    path: "/",
    element: (
      <AuthLayout authentication>
        <App />
      </AuthLayout>
    ),
    children: [
      {
        path: "/login",
        element: (
          <AuthLayout authentication={true}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/forgot-password",
        element: (
          <AuthLayout authentication>
            <ForgotPassword />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          // <AuthLayout authentication={false}>
          <Signup />
          // </AuthLayout>
        ),
      },
      {
        path: "/:user",
        element: (
          <AuthLayout authentication>
            <StoreLayout />
          </AuthLayout>
        ),
        children: [
          {
            path: "welcome-page",
            element: (
              <AuthLayout authentication={true}>
                <WelcomePage />
              </AuthLayout>
            ),
          },
          {
            path: "whatsapp",
            element: (
              <AuthLayout authentication={true}>
                <WhatsAppSettings />
              </AuthLayout>
            ),
          },
          {
            path: "register-business",
            element: (
              <AuthLayout authentication={true}>
                <RegisterBusiness />
              </AuthLayout>
            ),
          },
          {
            path: "add-role",
            element: (
              <AuthLayout authentication={true}>
                <AddRole />
              </AuthLayout>
            ),
          },
          {
            path: "dashboard",
            element: (
              <AuthLayout authentication>
                <Dashboard />
              </AuthLayout>
            ),
          },

          {
            path: ":category",
            element: (
              <AuthLayout authentication>
                <Home />
              </AuthLayout>
            ),
          },
          {
            path: ":category/:feature",
            element: (
              <AuthLayout authentication>
                <Home />
              </AuthLayout>
            ),
          },
          {
            path: "sales/bill-payment/:billId",
            element: (
              <AuthLayout authentication>
                <Home />
              </AuthLayout>
            ),
          },
          {
            path: "sales/view-bill/:billId",
            element: (
              <AuthLayout authentication>
                <Home />
              </AuthLayout>
            ),
          },
        ]
      },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} fallbackElement={<Loader />} />
    </Provider>
  </React.StrictMode>,
)