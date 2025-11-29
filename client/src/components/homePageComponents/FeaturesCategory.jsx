import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setActiveFeatureIndex } from '../../store/slices/navItems/navItemsSlice';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  FileText,
  RotateCcw,
  TrendingUp,
  UserPlus,
  DollarSign,
  Building,
  Truck,
  BarChart3,
  Tag,
  Archive,
  Calendar,
  Receipt,
  BookOpen,
  UserCog,
  Shield,
  Package,
  ShoppingBag,
  ArrowLeftRight
} from 'lucide-react';

// Icon mapping for child items
const childIconMap = {
  'Sale Item (Invoice)': ShoppingBag,
  'Sale Return Against Bill': RotateCcw,
  'Direct Sale Return': ArrowLeftRight,
  'Sale Report': TrendingUp,
  'Bill Reports': Receipt,
  'Merge Bills': FileText,
  'Add Customer': UserPlus,
  'My Customers': UserCog,
  'Bill Payment': DollarSign,
  'Account Receivables': DollarSign,
  'Purchase Item': Package,
  'Purchase Return': RotateCcw,
  'Purchase Report': BarChart3,
  'Add Company': Building,
  'All Companies': Building,
  'Add Supplier': Truck,
  'All Supplier': Truck,
  'Registration': FileText,
  'Stock Increase': TrendingUp,
  'Stock Report': BarChart3,
  'Changed Price Report': Tag,
  'Add Item Category': Archive,
  'Add Item Type': Tag,
  'Bar Code Printing': Tag,
  'Stock Search': BarChart3,
  'Expiry Report': Calendar,
  'Short Items List': Archive,
  'Expense Entry': Receipt,
  'Vendor Journal Entry': BookOpen,
  'Customer Journal Entry': BookOpen,
  'Opening & Adjustment Balance': BarChart3,
  'New Ledger': FileText,
  'Ledger Accounts': BookOpen,
  'Merge Accounts': FileText,
  'Income Statement': TrendingUp,
  'Add New Users': UserPlus,
  'Rights': Shield,
  'All Users': UserCog
};

function FeaturesCategory() {
  const navCategoryData = useSelector((state) => state.navItems.navItemCategoryData);
  const activeIndex = useSelector((state) => state.navItems.activeFeatureIndex);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleItemClick = (index, slug) => {
    if (index !== null && index !== undefined) {
      dispatch(setActiveFeatureIndex({ activeIndex: index }));
    }
    navigate(slug);
  };

  const getChildIcon = (childName) => {
    const IconComponent = childIconMap[childName] || FileText;
    return IconComponent;
  };

  return navCategoryData ? (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? '4rem' : '16.666667%' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className='h-[85svh] mt-3 rounded-r-md bg-gradient-to-b from-primary via-primary to-slate-900 shadow-2xl relative'
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

      {/* Toggle button */}
      <motion.button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 -top-2 z-20 bg-white hover:bg-primary border-2 border-primary text-white rounded-full p-1.5 shadow-lg transition-colors group" // <-- ADD 'group' class here
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <motion.div
          animate={{ rotate: isCollapsed ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Use 'group-hover:text-white' on the icon */}
          <ChevronLeft size={16} className={`text-primary group-hover:text-white`} />
        </motion.div>
      </motion.button>

      <div className='h-full overflow-y-auto overflow-x-visible scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent'>
        <ul className='flex flex-col gap-1 pt-6 px-3 pb-4'>
          {navCategoryData.map((item, i) => {
            const IconComponent = getChildIcon(item.name);
            const isActive = activeIndex === i;
            const isDisabled = !item.active;

            return (
              <motion.li
                key={i}
                className={`w-full ${isDisabled ? 'cursor-not-allowed' : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onMouseEnter={(e) => {
                  if (isCollapsed && !isDisabled) {
                    const tooltip = e.currentTarget.querySelector('.tooltip');
                    if (tooltip) {
                      tooltip.style.display = 'block';
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  if (isCollapsed) {
                    const tooltip = e.currentTarget.querySelector('.tooltip');
                    if (tooltip) {
                      tooltip.style.display = 'none';
                    }
                  }
                }}
              >
                <div className="relative">
                  <motion.button
                    onClick={() => !isDisabled && handleItemClick(i, item.slug)}
                    disabled={isDisabled}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium
                      transition-all duration-300 relative overflow-hidden
                      ${isDisabled
                        ? 'opacity-40 cursor-not-allowed'
                        : 'cursor-pointer'
                      }
                      ${isActive
                        ? 'bg-white text-gray-800 shadow-lg shadow-white/30'
                        : 'text-white hover:bg-slate-700/50 '
                      }
                    `}
                    whileHover={!isDisabled ? { x: 4 } : {}}
                    whileTap={!isDisabled ? { scale: 0.98 } : {}}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-gray-700 rounded-r-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}

                    {/* Icon with animation */}
                    <motion.div
                      className="flex-shrink-0"
                      // animate={{
                      //   scale: isActive ? 1.1 : 1,
                      // }}
                      // transition={{ duration: 0.3 }}
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        rotate: isActive ? [0, -10, 10, -10, 0] : 0
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <IconComponent size={18} strokeWidth={2} />
                    </motion.div>

                    {/* Text with collapse animation */}
                    <AnimatePresence mode="wait">
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`text-xs font-medium whitespace-nowrap overflow-hidden ${isActive ? 'font-semibold' : ''
                            }`}
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Subtle hover glow effect */}
                    {!isDisabled && (
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors rounded-lg" />
                    )}
                  </motion.button>

                  {/* Tooltip on hover when collapsed - Portal style */}
                  {isCollapsed && !isDisabled && (
                    <div
                      className="tooltip fixed ml-2 px-3 py-2 
                               bg-slate-800 text-white text-sm font-medium rounded-lg shadow-xl
                               whitespace-nowrap z-[9999] hidden
                               border border-slate-700 pointer-events-none"
                      style={{
                        left: '4rem',
                        top: `${85 + (i * 44)}px`
                      }}
                    >
                      {item.name}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 
                                    border-4 border-transparent border-r-slate-800" />
                    </div>
                  )}
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />

      {/* Collapsed tooltip hint (optional) */}
      {isCollapsed && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-slate-500 text-xs opacity-50">
          <ChevronLeft size={12} className="rotate-180" />
        </div>
      )}
    </motion.div>
  ) : null;
}

export default FeaturesCategory;