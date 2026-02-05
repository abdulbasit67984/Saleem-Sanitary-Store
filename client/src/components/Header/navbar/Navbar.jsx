/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setActiveFeatureIndex, setNavItemCategoryData } from '../../../store/slices/navItems/navItemsSlice'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  // ... keep your imports exactly as they were
  LayoutDashboard, ShoppingCart, Package, Box, Wallet, Users, MessageCircle, UserPlus, Building2, Shield, ChevronDown, FileText, RotateCcw, TrendingUp, UserCheck, CreditCard, DollarSign, ShoppingBag, Truck, Factory, BarChart3, Plus, PlusCircle, Layers, Printer, Search, AlertCircle, List, Calendar, BookOpen, GitMerge,
} from 'lucide-react'


// ... Keep iconMap exactly as is ...
const iconMap = {
  'Dashboard': LayoutDashboard,
  'Sales': ShoppingCart,
  'Purchases': ShoppingBag,
  'Stock': Box,
  'Accounts': Wallet,
  'Users': Users,
  'Whatsapp Settings': MessageCircle,
  'Register account': UserPlus,
  'Register Business': Building2,
  'Add Roles': Shield,
  'Sale Item (Invoice)': FileText,
  'Sale Return Against Bill': RotateCcw,
  'Direct Sale Return': RotateCcw,
  'Sale Report': TrendingUp,
  'Bill Reports': FileText,
  'Merge Bills': GitMerge,
  'Add Customer': UserCheck,
  'My Customers': Users,
  'Bill Payment': CreditCard,
  'Account Receivables': DollarSign,
  'Purchase Item': ShoppingBag,
  'Purchase Return': RotateCcw,
  'Purchase Report': BarChart3,
  'Add Company': Factory,
  'All Companies': Building2,
  'Add Supplier': Truck,
  'All Supplier': Truck,
  'Registration': FileText,
  'Stock Increase': TrendingUp,
  'Stock Report': BarChart3,
  'Changed Price Report': TrendingUp,
  'Add Item Category': Layers,
  'Add Item Type': Plus,
  'Bar Code Printing': Printer,
  'Stock Search': Search,
  'Expiry Report': AlertCircle,
  'Short Items List': List,
  'Daily Reports': Calendar,
  'Expense Entry': DollarSign,
  'Vendor Journal Entry': BookOpen,
  'Customer Journal Entry': BookOpen,
  'Opening & Adjustment Balance': DollarSign,
  'New Ledger': PlusCircle,
  'Ledger Accounts': BookOpen,
  'Merge Accounts': GitMerge,
  'Income Statement': BarChart3,
  'Add New Users': UserPlus,
  'Rights': Shield,
  'All Users': Users
}

// ... Keep DropdownItem exactly as is ...
const DropdownItem = ({ child, idx, onSelect }) => {
  const [isChildHovered, setIsChildHovered] = useState(false)
  const ChildIcon = iconMap[child.name] || Box
  const isChildDisabled = !child.active

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.03 }}
      onMouseEnter={() => setIsChildHovered(true)}
      onMouseLeave={() => setIsChildHovered(false)}
    >
      <NavLink
        to={child.slug}
        onClick={(e) => {
          if (isChildDisabled) {
            e.preventDefault()
            return
          }

          onSelect?.(idx)
        }}
        className={({ isActive }) =>
          `
            flex items-center gap-3 px-4 py-2 rounded-xl text-xs
            transition-all duration-200 group
            ${isActive ? 'bg-white/15 shadow-md' : ''}
            ${isChildDisabled 
              ? 'opacity-40 cursor-not-allowed text-gray-400' 
              : 'text-white hover:bg-white/10 cursor-pointer'
            }
          `
        }
      >
        <motion.div
          animate={isChildHovered && !isChildDisabled ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-shrink-0"
        >
          <ChildIcon className="w-4 h-4" />
        </motion.div>

        <span className="flex-1">{child.name}</span>

        {!isChildDisabled && (
          <motion.div
            initial={{ scale: 0 }}
            animate={isChildHovered ? { scale: 1 } : { scale: 0 }}
            className="w-1.5 h-1.5 rounded-full bg-blue-400"
          />
        )}
      </NavLink>
    </motion.div>
  )
}

function Navbar({ data, currentUser }) {
  const navData = data
  const dispatch = useDispatch()
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [openDropdown, setOpenDropdown] = useState(null)
  
  // NEW: State to hold coordinates for the dropdown
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 })

  const userIsAdmin = currentUser?.role?.toLowerCase() === 'admin'

  const handleNavItems = (i) => {
    const item = navData[i]

    if (!item.active) {
      return
    }

    if (item && item.Children) {
      dispatch(setNavItemCategoryData(item.Children))
    } else {
      dispatch(setNavItemCategoryData(null))
    }
    dispatch(setActiveFeatureIndex({ activeIndex: null }))
  }

  // NEW: Helper to calculate position on hover
  const handleMouseEnter = (e, i, hasChildren, isFeatureDisabled) => {
    setHoveredIndex(i)
    
    if (hasChildren && !isFeatureDisabled) {
      // Get the position of the hovered element
      const rect = e.currentTarget.getBoundingClientRect()
      
      // Update state with coordinates relative to the window
      setDropdownPos({
        top: rect.bottom + 10, // 10px gap
        left: rect.left
      })
      
      setOpenDropdown(i)
    }
  }

  return (
    <nav className="relative w-full">
      <div className="w-full overflow-x-auto scrollbar-none">
        <ul className="flex items-center scrollbar-thin justify-start gap-2 text-white min-w-max px-1 py-2 "> 
          {/* Added pb-4 pt-2 to give space for shadows/animations without clipping immediate edges */}
          
          {navData.map((item, i) => {
            if (item.isAdmin && !userIsAdmin) {
              return null
            }

            const isFeatureDisabled = !item.active
            const hasChildren = item.Children && item.Children.length > 0
            const Icon = iconMap[item.name] || Box

            return (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="relative" // Relative is fine here, but dropdown will be Fixed
                // Update Mouse Enter to capture coordinates
                onMouseEnter={(e) => handleMouseEnter(e, i, hasChildren, isFeatureDisabled)}
                onMouseLeave={() => {
                  setHoveredIndex(null)
                  setOpenDropdown(null)
                }}
              >
                <button
                  onClick={() => handleNavItems(i)}
                  disabled={isFeatureDisabled}
                  className="focus:outline-none"
                >
                  <NavLink
                    to={item.slug}
                    className={({ isActive }) =>
                      `
                        relative flex items-center gap-1.5 px-2 py-2 rounded-xl text-xs font-medium
                        transition-all duration-300 text-nowrap
                        ${isActive ? 'bg-white/20 shadow-lg' : ''}
                        ${isFeatureDisabled 
                          ? 'opacity-40 cursor-not-allowed pointer-events-none' 
                          : 'hover:bg-white/10'
                        }
                      `
                    }
                    onClick={(e) => {
                      if (isFeatureDisabled) e.preventDefault()
                    }}
                  >
                    <motion.div
                      animate={
                        hoveredIndex === i && !isFeatureDisabled
                          ? { 
                              rotate: [0, -10, 10, -10, 0],
                              scale: [1, 1.1, 1.1, 1.1, 1]
                            }
                          : {}
                      }
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-4 h-4" />
                    </motion.div>

                    <span className="relative">{item.name}</span>

                    {hasChildren && (
                      <motion.div
                        animate={{ rotate: openDropdown === i ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-3 h-3" />
                      </motion.div>
                    )}

                    {hoveredIndex === i && !isFeatureDisabled && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary/50 to-purple-400/20 rounded-xl blur-xl -z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </NavLink>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {hasChildren && openDropdown === i && !isFeatureDisabled && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      // CHANGED: Position fixed allows it to escape the scroll container
                      // Added z-50 to ensure it is on top of everything
                      className="fixed min-w-[180px] bg-gradient-to-br from-slate-800/95 to-slate-900/95 rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-[9999] backdrop-blur-xl "
                      style={{
                        top: dropdownPos.top,
                        left: dropdownPos.left
                      }}
                    >
                      <div className="p-2 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                        {item.Children.map((child, idx) => (
                          <DropdownItem
                            key={idx}
                            child={child}
                            idx={idx}
                            onSelect={(childIndex) => {
                              dispatch(setNavItemCategoryData(item.Children))
                              dispatch(setActiveFeatureIndex({ activeIndex: childIndex }))
                              setOpenDropdown(null)
                              setHoveredIndex(null)
                            }}
                          />
                        ))}
                      </div>

                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar