import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { saveAs } from 'file-saver';

const ShortItemList = () => {
  const allProducts = useSelector((state) => state.saleItems.allProducts);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortKey, setSortKey] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // 🆕 Added search term
  const itemsPerPage = 500;

  const filteredProducts = useMemo(() => {
    return allProducts?.filter((product) => {
      const packs = product.productPack || 1;
      const remaining = product.productTotalQuantity / packs;

      if (remaining <= 0) return statusFilter === "Out of Stock" || statusFilter === "All";
      if (remaining <= 3) return statusFilter === "Critical" || statusFilter === "All";
      if (remaining < 10) return statusFilter === "Low Stock" || statusFilter === "All";
      return false;
    });
  }, [allProducts, statusFilter]);

  const searchedProducts = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return filteredProducts?.filter((product) => {
      const name = product.productName?.toLowerCase() || "";
      const type = product.typeDetails[0]?.typeName?.toLowerCase() || "";
      const company = product.companyDetails[0]?.companyName?.toLowerCase() || "";
      return (
        name.includes(query) ||
        type.includes(query) ||
        company.includes(query)
      );
    });
  }, [filteredProducts, searchTerm]);

  const sortedProducts = useMemo(() => {
    const sorted = [...(searchedProducts || [])];
    if (sortKey === "name") {
      sorted.sort((a, b) => a.productName.localeCompare(b.productName));
    } else if (sortKey === "quantity") {
      sorted.sort((a, b) =>
        (a.productTotalQuantity / a.productPack) - (b.productTotalQuantity / b.productPack)
      );
    }
    return sorted;
  }, [searchedProducts, sortKey]);

  const totalPages = Math.ceil((sortedProducts?.length || 0) / itemsPerPage);
  const currentProducts = sortedProducts?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleExportCSV = () => {
    const headers = "Product Name,Type,Company,Remaining Packs,Status\n";
    const rows = sortedProducts.map(product => {
      const packs = product.productPack || 1;
      const remaining = (product.productTotalQuantity / packs).toFixed(2);
      const status = remaining === "0.00" ? "Out of Stock" : remaining <= 3 ? "Critical" : "Low Stock";
      return `${product.productName},${product.typeDetails[0]?.typeName},${product.companyDetails[0]?.companyName},${remaining},${status}`;
    });
    const csv = headers + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "low_stock_products.csv");
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-700">Low Stock Items</h2>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="text"
            placeholder="Search name, type, or company"
            className="border rounded px-2 py-1 text-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            className="border rounded px-2 py-1 text-sm"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All</option>
            <option value="Critical">Critical</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="quantity">Sort by Quantity</option>
          </select>
          <button
            onClick={handleExportCSV}
            className="bg-blue-500 text-white px-3 py-1 text-xs rounded hover:bg-blue-600"
          >
            Export CSV
          </button>
        </div>
      </div>

      {currentProducts?.length === 0 ? (
        <p className="text-gray-500 text-sm">All products are sufficiently stocked.</p>
      ) : (
        <div className="overflow-x-auto max-h-96">
          <table className="w-full border border-gray-200 text-xs rounded-lg">
            <thead className="bg-gray-100 text-left text-gray-600 font-semibold">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">Product Name</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Company</th>
                <th className="p-2 border">Remaining Quantity</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product, index) => {
                const packs = product.productPack || 1;
                const remaining = (product.productTotalQuantity / packs).toFixed(2);
                const isOutOfStock = remaining <= "0.00";
                const isCritical = remaining <= 3 && !isOutOfStock;
                const status = isOutOfStock
                  ? "Out of Stock"
                  : isCritical
                    ? "Critical"
                    : "Low Stock";

                return (
                  <tr
                    key={product._id}
                    className={`text-gray-700 hover:bg-gray-50 ${isCritical ? "bg-red-50" : ""}`}
                  >
                    <td className="p-2 border">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="p-2 border">{product.productName}</td>
                    <td className="p-2 border">{product.typeDetails[0]?.typeName}</td>
                    <td className="p-2 border">{product.companyDetails[0]?.companyName}</td>
                    <td className={`p-2 border font-semibold ${isOutOfStock ? "text-gray-400" : isCritical ? "text-red-500" : "text-yellow-600"}`}>
                      {remaining}
                    </td>
                    <td className="p-2 border text-xs font-bold">
                      {isOutOfStock ? (
                        <span className="text-gray-400">❌ Out of Stock</span>
                      ) : isCritical ? (
                        <span className="text-red-500">⚠ Critical</span>
                      ) : (
                        <span className="text-yellow-500">⚡ Low Stock</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-end mt-3 gap-1 text-sm">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border ${currentPage === i + 1 ? "bg-gray-700 text-white" : "bg-white"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

    </div>
  );
};

export default ShortItemList;
