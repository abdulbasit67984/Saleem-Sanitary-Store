import React, { useState } from "react";
import { useSelector } from "react-redux";
import Button from "../../Button";

const ITEMS_PER_PAGE = 200;

const ChangedPriceReport = () => {
  const allProducts = useSelector((state) => state.saleItems.allProducts);
  const [expandedRows, setExpandedRows] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleRow = (productId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const changedPriceProducts =
    allProducts
      ?.filter((product) =>
        product.statusOfPriceDetails.some((s) => s.oldPrice !== s.newPrice)
      )
      .map((product) => ({
        productId: product._id,
        productName: product.productName,
        category: product.categoryDetails?.[0]?.categoryName || "N/A",
        type: product.typeDetails?.[0]?.typeName || "N/A",
        company: product.companyDetails?.[0]?.companyName || "N/A",
        statusHistory: product.statusOfPriceDetails.filter(
          (s) => s.oldPrice !== s.newPrice
        ),
      })) || [];

  // Helper: Highlight search term in text
  const highlightMatch = (text, term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Filter by search term across productName, type, category, company
  const filteredProducts = changedPriceProducts.filter((product) => {
    const lower = searchTerm.toLowerCase();
    return (
      product.productName.toLowerCase().includes(lower) ||
      product.type.toLowerCase().includes(lower) ||
      product.category.toLowerCase().includes(lower) ||
      product.company.toLowerCase().includes(lower)
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Changed Price Report
      </h2>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by product name, type, category, or company..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-md w-full text-sm"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">No matching products found.</p>
      ) : (
        <div className="overflow-x-auto max-h-96 scrollbar-thin">
          <table className="w-full border text-xs border-gray-200 rounded-md">
            <thead className="bg-gray-400">
              <tr className="text-gray-700">
                <th className="px-4 py-2 text-left">Product Name</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Company</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => (
                <React.Fragment key={product.productId}>
                  <tr
                    className="border-b cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleRow(product.productId)}
                  >
                    <td className="px-4 py-2">
                      {highlightMatch(product.productName, searchTerm)}
                    </td>
                    <td className="px-4 py-2">
                      {highlightMatch(product.type, searchTerm)}
                    </td>
                    <td className="px-4 py-2">
                      {highlightMatch(product.category, searchTerm)}
                    </td>
                    <td className="px-4 py-2">
                      {highlightMatch(product.company, searchTerm)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {expandedRows[product.productId] ? "▼" : "▶"}
                    </td>
                  </tr>

                  {expandedRows[product.productId] && (
                    <tr className="bg-gray-300">
                      <td colSpan="5">
                        <div className="p-4">
                          <h3 className="text-md font-semibold text-gray-700">
                            Price Change History
                          </h3>
                          <table className="w-full mt-2 border border-gray-100 rounded-md">
                            <thead className="bg-gray-200">
                              <tr className="text-gray-700">
                                <th className="px-4 py-2 text-left">Changed Date</th>
                                <th className="px-4 py-2 text-left">Old Price</th>
                                <th className="px-4 py-2 text-left">New Price</th>
                                <th className="px-4 py-2 text-left">Remaining Qty</th>
                                <th className="px-4 py-2 text-left">Changed By</th>
                              </tr>
                            </thead>
                            <tbody>
                              {product.statusHistory.map((status, index) => (
                                <tr key={index} className="border-b bg-gray-50">
                                  <td className="px-4 py-2 text-red-500 font-medium">
                                    {status.createdAt.slice(0, 10)}
                                  </td>
                                  <td className="px-4 py-2 text-red-500 font-medium">
                                    {status.oldPrice}
                                  </td>
                                  <td className="px-4 py-2 text-green-500 font-medium">
                                    {status.newPrice}
                                  </td>
                                  <td className="px-4 py-2">
                                    {status.remainingQuantity}
                                  </td>
                                  <td className="px-4 py-2">
                                    {status.changedByDetails.firstname +
                                      " " +
                                      status.changedByDetails.lastname}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <Button
            className={`px-4 py-2 rounded-md ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
            }`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
            }`}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChangedPriceReport;
