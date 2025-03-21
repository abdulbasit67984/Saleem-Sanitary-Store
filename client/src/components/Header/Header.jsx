/* eslint-disable no-unused-vars */
import React, { useState, useEffect, Children } from 'react'
import { Container, Logo, LogoutBtn } from '../index'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Navbar from './navbar/Navbar'
import { useParams } from 'react-router-dom'
import authService from '../../features/auth'
import { setCurrentUser } from '../../store/slices/auth/authSlice'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const { userData, primaryPath } = useSelector((state) => state.auth)
  const [user, setUser] = useState(null)
  // const [primaryPath, setPrimaryPath] = useState('store')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // const currentUser = async () => {
  //   const response = await authService.getCurrentUser()
  //   if (response) {
  //     console.log("header: ", response.data);
  //     dispatch(setCurrentUser(response.data))
  //     setUser(response.data)
  //   }
  // }
  useEffect(() => {
    // currentUser()
    // if (!user) {
    //   setUser(userData)
    // }
    // console.log('authSlice primary Path in header: ', primaryPath);
    
    // setPrimaryPath((userData?.BusinessId ? userData.BusinessId.businessName : userData?.username)?.replace(/ /g, '-'))
  }, [])


  const isAdmin = () => userData.role === 'admin';

  const navItems = [
    {
      name: 'Dashboard',
      slug: `/${primaryPath}/dashboard`,
      active: true,

    },
    {
      name: 'Sales',
      slug: `/${primaryPath}/sales`,
      active: true,
      Children: [
        {
          name: 'Sale Item (Reciept)',
          slug: `/${primaryPath}/sales/sale-item-receipt`,
          active: false
        },
        {
          name: 'Sale Item (Invoice)',
          slug: `/${primaryPath}/sales/sale-item-invoice`,
          active: true
        },
        {
          name: 'Sale Return Against Bill',
          slug: `/${primaryPath}/sales/sale-return-against-bill`,
          active: true
        },
        {
          name: 'Direct Sale Return',
          slug: `/${primaryPath}/sales/direct-sale-return`,
          active: true
        },
        {
          name: 'Sold Item Reports',
          slug: `/${primaryPath}/sales/sold-item`,
          active: true
        },
        {
          name: 'Sale Reports',
          slug: `/${primaryPath}/sales/sale-reports`,
          active: false
        },
        {
          name: 'View Bill',
          slug: `/${primaryPath}/sales/view-bill`,
          active: false
        },
        {
          name: 'Sale Reports (For Sales Man)',
          slug: `/${primaryPath}/sales/sale-report-for-sales-man`,
          active: false
        },
        {
          name: 'Add Customer',
          slug: `/${primaryPath}/sales/add-customer`,
          active: true
        },
        {
          name: 'My Customers',
          slug: `/${primaryPath}/sales/my-customers`,
          active: true
        },
        {
          name: 'Bill Payment',
          slug: `/${primaryPath}/sales/bill-payment`,
          active: true
        },
        {
          name: 'Bill Payment Report',
          slug: `/${primaryPath}/sales/bill-payment-report`,
          active: false
        },
        {
          name: 'Account Receivables',
          slug: `/${primaryPath}/sales/account-receivables`,
          active: true
        },
        {
          name: 'Account Receivables (ALL)',
          slug: `/${primaryPath}/sales/account-receivables-all`,
          active: false
        },
      ]
    },
    {
      name: "Purchases",
      slug: `/${primaryPath}/purchases`,
      active: true,
      Children: [
        {
          name: 'Purchase Item',
          slug: `/${primaryPath}/purchases/purchase-item`,
          active: true
        },
        {
          name: 'Purchase Return',
          slug: `/${primaryPath}/purchases/purchase-return`,
          active: true
        },
        {
          name: 'Direct Purchase Return',
          slug: `/${primaryPath}/purchases/direct-purchase-return`,
          active: false
        },
        {
          name: 'Purchase Adjustment',
          slug: `/${primaryPath}/purchases/purchase-adjustment`,
          active: false
        },
        {
          name: 'Purchase Report',
          slug: `/${primaryPath}/purchases/purchase-report`,
          active: true
        },
        {
          name: 'Purchase Order',
          slug: `/${primaryPath}/purchases/purchase-order`,
          active: false
        },
        {
          name: 'Received QTY Against Purchase Order',
          slug: `/${primaryPath}/purchases/received-qty-against-purchase-order`,
          active: false
        },
        {
          name: 'Add Company',
          slug: `/${primaryPath}/purchases/add-company`,
          active: true
        },
        {
          name: 'All Companies',
          slug: `/${primaryPath}/purchases/companies`,
          active: true
        },
        {
          name: 'Add Supplier',
          slug: `/${primaryPath}/purchases/add-supplier`,
          active: true
        },
        {
          name: 'All Supplier',
          slug: `/${primaryPath}/purchases/suppliers`,
          active: true
        },
        {
          name: 'Add Adda',
          slug: `/${primaryPath}/purchases/add-adda`,
          active: false
        },
        {
          name: 'Add Supplier',
          slug: `/${primaryPath}/purchases/add-suplier`,
          active: false
        },
        {
          name: 'Account Payables',
          slug: `/${primaryPath}/purchases/account-payable`,
          active: true
        },
        {
          name: 'Account Payables (ALL)',
          slug: `/${primaryPath}/purchases/account-payable-all`,
          active: true
        },
      ]
    },
    {
      name: "Stock",
      slug: `/${primaryPath}/stock`,
      active: true,
      Children: [
        {
          name: 'Registration',
          slug: `/${primaryPath}/stock/registration`,
          active: true
        },
        {
          name: 'Stock Increase',
          slug: `/${primaryPath}/stock/stock-increase`,
          active: true
        },
        {
          name: 'Stock Decrease',
          slug: `/${primaryPath}/stock/stock-decrease`,
          active: false
        },
        {
          name: 'Stock Report',
          slug: `/${primaryPath}/stock/stock-report`,
          active: true
        },
        {
          name: 'Changed Price Report',
          slug: `/${primaryPath}/stock/changed-sale-price-report`,
          active: true
        },
        {
          name: 'Add Item Category',
          slug: `/${primaryPath}/stock/add-item-category`,
          active: true
        },
        {
          name: 'Add Item Type',
          slug: `/${primaryPath}/stock/add-item-type`,
          active: true
        },
        {
          name: 'Bar Code Printing',
          slug: `/${primaryPath}/stock/bar-code-printing`,
          active: true
        },
        {
          name: 'Shift Stock',
          slug: `/${primaryPath}/stock/shift-stock`,
          active: false
        },
        {
          name: 'Add Godown',
          slug: `/${primaryPath}/stock/add-godown`,
          active: false
        },
        {
          name: 'Stock Search',
          slug: `/${primaryPath}/stock/stock-search`,
          active: true
        },
        {
          name: 'Expiry Report',
          slug: `/${primaryPath}/stock/expiry-report`,
          active: true
        },
        {
          name: 'Short Items List',
          slug: `/${primaryPath}/stock/short-item-list`,
          active: true
        },
        {
          name: 'Dead Items Supplier Wise',
          slug: `/${primaryPath}/stock/dead-items-supplier-wise`,
          active: false
        },
        {
          name: 'Add Branches',
          slug: `/${primaryPath}/stock/add-branches`,
          active: false
        },
        {
          name: 'Branch Stock Shifting',
          slug: `/${primaryPath}/stock/branch-stock-shifting`,
          active: false
        },

      ]
    },
    {
      name: "Accounts",
      slug: `/${primaryPath}/accounts`,
      active: true,
      Children: [
        {
          name: "Expense Entry",
          slug: `/${primaryPath}/accounts/expense-entry`,
          active: true
        },
        {
          name: "Vendor Journal Entry",
          slug: `/${primaryPath}/accounts/vendor-journal-entry`,
          active: true
        },
        {
          name: "Customer Journal Entry",
          slug: `/${primaryPath}/accounts/customer-journal-entry`,
          active: true
        },
        {
          name: "Opening & Adjustment Balance",
          slug: `/${primaryPath}/accounts/opening-&-adjustment-balance`,
          active: true
        },
        {
          name: "Expense Account(s) Posting",
          slug: `/${primaryPath}/accounts/expense-account-posting`,
          active: false
        },
        {
          name: "New Ledger",
          slug: `/${primaryPath}/accounts/new-account`,
          active: true
        },
        {
          name: "Add New Cheque",
          slug: `/${primaryPath}/accounts/add-new-cheque`,
          active: false
        },
        {
          name: "Daily Posted Ledgers Report",
          slug: `/${primaryPath}/accounts/daily-posted-ledgers-report`,
          active: false
        },
        {
          name: "Ledger Accounts",
          slug: `/${primaryPath}/accounts/ledger`,
          active: true
        },
        {
          name: "Cash Flow",
          slug: `/${primaryPath}/accounts/cash-flow`,
          active: false
        },
        {
          name: "Merge Accounts",
          slug: `/${primaryPath}/accounts/merge-accounts`,
          active: true
        },
        {
          name: "Income Statement",
          slug: `/${primaryPath}/accounts/income-statement`,
          active: true
        },
        {
          name: "Accounts Activity",
          slug: `/${primaryPath}/accounts/accounts-activity`,
          active: false
        },
        {
          name: "Parties Cash Items Group Wise Report",
          slug: `/${primaryPath}/accounts/parties-cash-items-group-wise-report`,
          active: false
        },
      ]
    },
    {
      name: "Users",
      slug: `/${primaryPath}/users`,
      active: true,
      Children: [
        {
          name: "Add New Users",
          slug: `/${primaryPath}/users/add-new-users`,
          active: true
        },
        {
          name: "Rights",
          slug: `/${primaryPath}/users/rights`,
          active: true
        },
        {
          name: "Change Password",
          slug: `/${primaryPath}/users/change-password`,
          active: true
        },
        {
          name: "Shift Timing",
          slug: `/${primaryPath}/users/shift-timing`,
          active: true
        },
        {
          name: "Contact Directory",
          slug: `/${primaryPath}/users/contact-directory`,
          active: true
        },
        {
          name: "Reminder",
          slug: `/${primaryPath}/users/reminder`,
          active: true
        },
        {
          name: "Close Day",
          slug: `/${primaryPath}/users/close-day`,
          active: true
        },
      ]
    },
    {
      name: "Calculator",
      slug: `/${primaryPath}/calculator`,
      active: true,
      Children: [
        {
          name: "Calculator",
          slug: `/${primaryPath}/calculator/cal`,
          active: true
        },
      ]
    },
    {
      name: 'Register account',
      slug: '/signup',
      active: isAdmin
    },
    {
      name: 'Register Business',
      slug: `/${primaryPath}/register-business`,
      active: true
    },
    {
      name: 'Add Roles',
      slug: `/${primaryPath}/add-role`,
      active: true
    }

  ]



  // return !authStatus ? (
  return authStatus ? (
    <>
      <header className={`bg-gray-500 shadow-lg  h-12 w-full `}>
        <Container>
          <nav className='flex items-center justify-end gap-3 pt-1 w-full'>
            {/* <Logo width='w-24 ' className='rounded-full opacity-90 ' /> */}
            <div className='flex items-center'>
              <Navbar data={navItems} />
            </div>


            <div className='w-full flex justify-end gap-3'>
              <button onClick={() => navigate('/login')} disabled={authStatus}>
                <img src={authStatus ? "../../../src/assets/user(2).png" : "../../../src/assets/user(1).png"} className='w-6 filter invert brightness-0' alt="" />
              </button>
              {authStatus &&
                <LogoutBtn />
              }
            </div>

          </nav>
        </Container>
      </header>

    </>
  ) : null
}

export default Header