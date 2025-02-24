/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import config from "../../../features/config";
import Loader from "../../../pages/Loader";

function StockReport() {


  const allProducts = useSelector((state) => state.saleItems.allProducts);
  const companyData = useSelector((state) => state.companies.companyData);
  const categoryData = useSelector((state) => state.categories.categoryData);
  const typeData = useSelector((state) => state.types.typeData);

  // Calculate summary values
  const totalProducts = allProducts?.length || 0;
  const totalCategories = categoryData?.length || 0;
  const totalTypes = typeData?.length || 0;
  const totalCompanies = companyData?.length || 0;
  const totalStockQuantity = allProducts?.reduce(
    (sum, product) => sum + ((product.productTotalQuantity / product.productPack) || 0),
    0
  );
  const outOfStockProducts = allProducts?.filter(
    (product) => product.productTotalQuantity <= 0
  ).length || 0;


  return(
    <div className="p-4 bg-white border rounded shadow-md text-sm">
      <h2 className="text-lg font-semibold mb-4">Stock Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <SummaryCard label="Total Products" value={totalProducts} />
        <SummaryCard label="Total Categories" value={totalCategories} />
        <SummaryCard label="Total Types" value={totalTypes} />
        <SummaryCard label="Total Companies" value={totalCompanies} />
        <SummaryCard label="Total Stock Quantity" value={Math.ceil(totalStockQuantity)} />
        <SummaryCard label="Out of Stock Products" value={outOfStockProducts} highlight />
      </div>
    </div>
  );
}

const SummaryCard = ({ label, value, highlight }) => (
  <div className={`p-4 rounded border shadow-sm ${highlight ? "bg-red-100 text-red-600 font-semibold" : "bg-gray-100"}`}>
    <p className="text-gray-700">{label}</p>
    <h3 className="text-xl font-bold">{value}</h3>
  </div>
);

export default StockReport;
