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

  useEffect(() => {

  }, [])


  const isAdmin = () => {
    return userData?.role === "admin"
  };
  console.log('userData', userData)
  console.log('isAdmin', isAdmin())

  const isOwner = () => {
    return userData?.role === "owner"
  };

  console.log('isOwner', isOwner())

  const hasRight = (right) => {
    return userData?.businessRole?.map(role => role.businessRoleName).includes(right)
  }
  console.log('hasRight', hasRight("Sales"))

  const navItems = [
    {
      name: 'Dashboard',
      slug: `/${primaryPath}/dashboard`,
      active: isAdmin() || isOwner() || hasRight("Dashboard"),
      isAdmin: isAdmin(),

    },
    {
      name: 'Sales',
      slug: `/${primaryPath}/sales`,
      active: isAdmin() || isOwner() || hasRight("Sales"),
      isAdmin: isAdmin(),
      Children: [
        {
          name: 'Sale Item (Invoice)',
          slug: `/${primaryPath}/sales/sale-item-invoice`,
          active: isAdmin() || isOwner() || hasRight("Sale Item (Invoice)"),
          isAdmin: isAdmin()
        },
        {
          name: 'Sale Return Against Bill',
          slug: `/${primaryPath}/sales/sale-return-against-bill`,
          active: isAdmin() || isOwner() || hasRight("Sale Return Against Bill"),
          isAdmin: isAdmin()
        },
        {
          name: 'Direct Sale Return',
          slug: `/${primaryPath}/sales/direct-sale-return`,
          active: isAdmin() || isOwner() || hasRight("Direct Sale Return"),
          isAdmin: isAdmin()
        },
        {
          name: 'Sale Report',
          slug: `/${primaryPath}/sales/sale-reports`,
          active: isAdmin() || isOwner() || hasRight("Sale Report"),
          isAdmin: isAdmin()
        },
        {
          name: 'Bill Reports',
          slug: `/${primaryPath}/sales/sold-item`,
          active: isAdmin() || isOwner() || hasRight("Sold Item Reports"),
          isAdmin: isAdmin()
        },
        {
          name: 'Merge Bills',
          slug: `/${primaryPath}/sales/merge-bills`,
          active: isAdmin() || isOwner() || hasRight("Merge Bills"),
          isAdmin: isAdmin()
        },
        {
          name: 'Add Customer',
          slug: `/${primaryPath}/sales/add-customer`,
          active: isAdmin() || isOwner() || hasRight("Add Customer"),
          isAdmin: isAdmin()
        },
        {
          name: 'My Customers',
          slug: `/${primaryPath}/sales/my-customers`,
          active: isAdmin() || isOwner() || hasRight("My Customers"),
          isAdmin: isAdmin()
        },
        {
          name: 'Bill Payment',
          slug: `/${primaryPath}/sales/bill-payment`,
          active: isAdmin() || isOwner() || hasRight("Bill Payment"),
          isAdmin: isAdmin()
        },
        {
          name: 'Account Receivables',
          slug: `/${primaryPath}/sales/account-receivables`,
          active: isAdmin() || isOwner() || hasRight("Account Receivables"),
          isAdmin: isAdmin()
        },
      ]
    },
    {
      name: "Purchases",
      slug: `/${primaryPath}/purchases`,
      active: isAdmin() || isOwner() || hasRight("Purchases"),
      isAdmin: isAdmin(),
      Children: [
        {
          name: 'Purchase Item',
          slug: `/${primaryPath}/purchases/purchase-item`,
          active: isAdmin() || isOwner() || hasRight("Purchase Item"),
          isAdmin: isAdmin()
        },
        {
          name: 'Purchase Return',
          slug: `/${primaryPath}/purchases/purchase-return`,
          active: isAdmin() || isOwner() || hasRight("Purchase Return"),
          isAdmin: isAdmin()
        },
        {
          name: 'Purchase Report',
          slug: `/${primaryPath}/purchases/purchase-report`,
          active: isAdmin() || isOwner() || hasRight("Purchase Report"),
          isAdmin: isAdmin()
        },
        {
          name: 'Add Company',
          slug: `/${primaryPath}/purchases/add-company`,
          active: isAdmin() || isOwner() || hasRight("Add Company"),
          isAdmin: isAdmin()
        },
        {
          name: 'All Companies',
          slug: `/${primaryPath}/purchases/companies`,
          active: isAdmin() || isOwner() || hasRight("All Companies"),
          isAdmin: isAdmin()
        },
        {
          name: 'Add Supplier',
          slug: `/${primaryPath}/purchases/add-supplier`,
          active: isAdmin() || isOwner() || hasRight("Add Supplier"),
          isAdmin: isAdmin()
        },
        {
          name: 'All Supplier',
          slug: `/${primaryPath}/purchases/suppliers`,
          active: isAdmin() || isOwner() || hasRight("All Supplier"),
          isAdmin: isAdmin()
        }
      ]
    },
    {
      name: "Stock",
      slug: `/${primaryPath}/stock`,
      active: isAdmin() || isOwner() || hasRight("Stock"),
      isAdmin: isAdmin(),
      Children: [
        {
          name: 'Registration',
          slug: `/${primaryPath}/stock/registration`,
          active: isAdmin() || isOwner() || hasRight("Registration"),
          isAdmin: isAdmin()
        },
        {
          name: 'Stock Increase',
          slug: `/${primaryPath}/stock/stock-increase`,
          active: isAdmin() || isOwner() || hasRight("Stock Increase"),
          isAdmin: isAdmin()
        },
        {
          name: 'Stock Report',
          slug: `/${primaryPath}/stock/stock-report`,
          active: isAdmin() || isOwner() || hasRight("Stock Report"),
          isAdmin: isAdmin()
        },
        {
          name: 'Changed Price Report',
          slug: `/${primaryPath}/stock/changed-sale-price-report`,
          active: isAdmin() || isOwner() || hasRight("Changed Price Report"),
          isAdmin: isAdmin()
        },
        {
          name: 'Add Item Category',
          slug: `/${primaryPath}/stock/add-item-category`,
          active: isAdmin() || isOwner() || hasRight("Add Item Category"),
          isAdmin: isAdmin()
        },
        {
          name: 'Add Item Type',
          slug: `/${primaryPath}/stock/add-item-type`,
          active: isAdmin() || isOwner() || hasRight("Add Item Type"),
          isAdmin: isAdmin()
        },
        {
          name: 'Bar Code Printing',
          slug: `/${primaryPath}/stock/barcode-printing`,
          active: isAdmin() || isOwner() || hasRight("Bar Code Printing"),
          isAdmin: isAdmin()
        },
        {
          name: 'Stock Search',
          slug: `/${primaryPath}/stock/stock-search`,
          active: isAdmin() || isOwner() || hasRight("Stock Search"),
          isAdmin: isAdmin()
        },
        {
          name: 'Expiry Report',
          slug: `/${primaryPath}/stock/expiry-report`,
          active: isAdmin() || isOwner() || hasRight("Expiry Report"),
          isAdmin: isAdmin()
        },
        {
          name: 'Short Items List',
          slug: `/${primaryPath}/stock/short-item-list`,
          active: isAdmin() || isOwner() || hasRight("Short Items List"),
          isAdmin: isAdmin()
        }
      ]
    },
    {
      name: "Accounts",
      slug: `/${primaryPath}/accounts`,
      active: isAdmin() || isOwner() || hasRight("Accounts"),
      isAdmin: isAdmin(),
      Children: [
        {
          name: "Expense Entry",
          slug: `/${primaryPath}/accounts/expense-entry`,
          active: isAdmin() || isOwner() || hasRight("Expense Entry"),
          isAdmin: isAdmin()
        },
        {
          name: "Vendor Journal Entry",
          slug: `/${primaryPath}/accounts/vendor-journal-entry`,
          active: isAdmin() || isOwner() || hasRight("Vendor Journal Entry"),
          isAdmin: isAdmin()
        },
        {
          name: "Customer Journal Entry",
          slug: `/${primaryPath}/accounts/customer-journal-entry`,
          active: isAdmin() || isOwner() || hasRight("Customer Journal Entry"),
          isAdmin: isAdmin()
        },
        {
          name: "Opening & Adjustment Balance",
          slug: `/${primaryPath}/accounts/opening-&-adjustment-balance`,
          active: isAdmin() || isOwner() || hasRight("Opening & Adjustment Balance"),
          isAdmin: isAdmin()
        },
        {
          name: "New Ledger",
          slug: `/${primaryPath}/accounts/new-account`,
          active: isAdmin() || isOwner() || hasRight("New Ledger"),
          isAdmin: isAdmin()
        },
        {
          name: "Ledger Accounts",
          slug: `/${primaryPath}/accounts/ledger`,
          active: isAdmin() || isOwner() || hasRight("Ledger Accounts"),
          isAdmin: isAdmin()
        },
        {
          name: "Merge Accounts",
          slug: `/${primaryPath}/accounts/merge-accounts`,
          active: isAdmin() || isOwner() || hasRight("Merge Accounts"),
          isAdmin: isAdmin()
        },
        {
          name: "Income Statement",
          slug: `/${primaryPath}/accounts/income-statement`,
          active: isAdmin() || isOwner() || hasRight("Income Statement"),
          isAdmin: isAdmin()
        }
      ]
    },
    {
      name: "Users",
      slug: `/${primaryPath}/users`,
      active: isAdmin() || isOwner() || hasRight("Users"),
      isAdmin: isAdmin(),
      Children: [
        {
          name: "Add New Users",
          slug: `/${primaryPath}/users/add-new-users`,
          active: isAdmin() || isOwner() || hasRight("Add New Users"),
          isAdmin: isAdmin()
        },
        {
          name: "Rights",
          slug: `/${primaryPath}/users/rights`,
          active: isAdmin() || isOwner() || hasRight("Rights"),
          isAdmin: isAdmin()
        },
        {
          name: "All Users",
          slug: `/${primaryPath}/users/all-users`,
          active: isAdmin() || isOwner() || hasRight("All Users"),
          isAdmin: isAdmin()
        }
      ]
    },
    {
      name: "Calculator",
      slug: `/${primaryPath}/calculator`,
      active: true,
      isAdmin: isAdmin(),
      Children: [
        {
          name: "Calc",
          slug: `/${primaryPath}/calculator/cal`,
          active: true,
          isAdmin: isAdmin()
        },
      ]
    },
    {
      name: 'Register account',
      slug: '/signup',
      active: isAdmin(),
      isAdmin: true
    },
    {
      name: 'Register Business',
      slug: `/${primaryPath}/register-business`,
      active: isAdmin() || isOwner(),
      isAdmin: isAdmin()
    },
    {
      name: 'Add Roles',
      slug: `/${primaryPath}/add-role`,
      active: isAdmin() || isOwner(),
      isAdmin: isAdmin()
    }

  ]



  // return !authStatus ? (
  return authStatus ? (
    <>
      <header className={`bg-primary shadow-md  h-12 w-full `}>
        <Container className={'shadow-lg z-50'}>
          <nav className='flex items-center justify-end gap-3 pt-1 w-full'>
            {/* <Logo width='w-24 ' className='rounded-full opacity-90 ' /> */}
            <div className='flex items-center'>
              <Navbar data={navItems} currentUser={userData} />
            </div>


            <div className='w-full flex justify-end gap-3'>
              <button onClick={() => {
                if (isOwner() || isAdmin()) navigate('/signup')
              }}
                disabled={!authStatus}>
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