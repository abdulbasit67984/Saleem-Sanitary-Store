import React from "react";
import { useSelector } from "react-redux";

const ShortItemList = () => {
  // Get products from Redux state
  const allProducts = useSelector((state) => state.saleItems.allProducts);
  
  // Filter products with quantity per pack < 10
  const lowStockProducts = allProducts?.filter((product) => 
    (product.productTotalQuantity / product.productPack) < 10
  );

  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Low Stock Items</h2>

      {lowStockProducts.length === 0 ? (
        <p className="text-gray-500 text-sm">All products are sufficiently stocked.</p>
      ) : (
        <div className="overflow-x-auto max-h-96">
          <table className="w-full border border-gray-200 text-xs rounded-lg">
            <thead className="bg-gray-100">
              <tr className="text-left text-gray-600  font-semibold">
                <th className="p-2 border">#</th>
                <th className="p-2 border">Product Name</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Company</th>
                <th className="p-2 border">Remaining Quantity</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map((product, index) => {
                const remainingPacks = (product.productTotalQuantity / product.productPack).toFixed(2);
                const isCritical = remainingPacks <= 3;

                return (
                  <tr key={product._id} className=" text-gray-700 hover:bg-gray-50">
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border">{product.productName}</td>
                    <td className="p-2 border">{product.typeDetails[0]?.typeName}</td>
                    <td className="p-2 border">{product.companyDetails[0]?.companyName}</td>
                    <td className={`p-2 border font-semibold ${isCritical ? "text-red-500" : "text-yellow-600"}`}>
                      {remainingPacks}
                    </td>
                    <td className="p-2 border">
                      {isCritical ? (
                        <span className="text-red-500 font-bold text-xs">⚠ Critical</span>
                      ) : (
                        <span className="text-yellow-500 font-bold text-xs">⚡ Low Stock</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ShortItemList;
