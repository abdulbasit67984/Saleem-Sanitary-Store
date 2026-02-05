/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Search, X, Package, Building2, Tag, Barcode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductSearchModal = ({ isOpen, onClose }) => {
  const { allProducts } = useSelector((state) => state.saleItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchType, setSearchType] = useState('all'); // all, name, code, category, company
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    let results = [];

    switch (searchType) {
      case 'name':
        results = allProducts.filter((product) =>
          product.productName?.toLowerCase().includes(query)
        );
        break;
      case 'code':
        results = allProducts.filter((product) =>
          product.productCode?.toLowerCase().includes(query)
        );
        break;
      case 'category':
        results = allProducts.filter((product) =>
          product.categoryDetails?.[0]?.categoryName?.toLowerCase().includes(query)
        );
        break;
      case 'company':
        results = allProducts.filter((product) =>
          product.companyDetails?.[0]?.companyName?.toLowerCase().includes(query)
        );
        break;
      default:
        results = allProducts.filter(
          (product) =>
            product.productName?.toLowerCase().includes(query) ||
            product.productCode?.toLowerCase().includes(query) ||
            product.categoryDetails?.[0]?.categoryName?.toLowerCase().includes(query) ||
            product.companyDetails?.[0]?.companyName?.toLowerCase().includes(query) ||
            product.typeDetails?.[0]?.typeName?.toLowerCase().includes(query)
        );
    }

    setFilteredProducts(results.slice(0, 100)); // Limit to 100 results for performance
  }, [searchQuery, searchType, allProducts]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleClose = () => {
    setSearchQuery('');
    setFilteredProducts([]);
    onClose();
  };

  const searchTypeOptions = [
    { value: 'all', label: 'All', icon: Search },
    { value: 'name', label: 'Name', icon: Package },
    { value: 'code', label: 'Code', icon: Barcode },
    { value: 'category', label: 'Category', icon: Tag },
    { value: 'company', label: 'Company', icon: Building2 },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-start justify-center pt-20"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Header */}
          <div className="bg-gradient-to-r from-primary to-slate-800 p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search products by name, code, category, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/95 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                />
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Search Type Filters */}
            <div className="flex gap-2 mt-3 flex-wrap">
              {searchTypeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setSearchType(option.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      searchType === option.value
                        ? 'bg-white text-primary'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results */}
          <div className="overflow-auto max-h-[calc(80vh-140px)]">
            {searchQuery && filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Package className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg">No products found</p>
                <p className="text-sm">Try a different search term</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="p-2">
                <p className="text-xs text-gray-500 px-2 py-1 mb-2">
                  Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                  {filteredProducts.length === 100 && ' (showing first 100)'}
                </p>
                <table className="w-full text-xs">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="text-left p-2 font-semibold">Code</th>
                      <th className="text-left p-2 font-semibold">Name</th>
                      <th className="text-left p-2 font-semibold">Category</th>
                      <th className="text-left p-2 font-semibold">Company</th>
                      <th className="text-left p-2 font-semibold">Type</th>
                      <th className="text-right p-2 font-semibold">Pack</th>
                      <th className="text-right p-2 font-semibold">Sale Price</th>
                      <th className="text-right p-2 font-semibold">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product, index) => (
                      <tr
                        key={product._id || index}
                        className="border-b hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <td className="p-2 font-mono text-blue-600">{product.productCode}</td>
                        <td className="p-2 font-medium">{product.productName}</td>
                        <td className="p-2 text-gray-600">
                          {product.categoryDetails?.[0]?.categoryName || '-'}
                        </td>
                        <td className="p-2 text-gray-600">
                          {product.companyDetails?.[0]?.companyName || '-'}
                        </td>
                        <td className="p-2 text-gray-600">
                          {product.typeDetails?.[0]?.typeName || '-'}
                        </td>
                        <td className="p-2 text-right">{product.productPack}</td>
                        <td className="p-2 text-right font-medium text-green-600">
                          {product.salePriceDetails?.[0]?.salePrice1?.toFixed(2) || '-'}
                        </td>
                        <td className={`p-2 text-right font-medium ${
                          product.productTotalQuantity <= 0 
                            ? 'text-red-500' 
                            : product.productTotalQuantity < 10 
                              ? 'text-yellow-600' 
                              : 'text-gray-700'
                        }`}>
                          {Math.ceil(product.productTotalQuantity / product.productPack)} pcs
                          <span className="text-gray-400 ml-1">
                            ({product.productTotalQuantity} {product.packUnit?.toUpperCase() || 'units'})
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Search className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg">Search for products</p>
                <p className="text-sm">Type to start searching...</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-2 border-t flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-[10px]">ESC</kbd>
                to close
              </span>
            </div>
            <span>Total Products: {allProducts?.length || 0}</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductSearchModal;
