/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';
import config from '../../../features/config';
import { useSelector } from 'react-redux';
import SearchableDropdown from '../../SearchableDropDown';

/*
  ReportsDashboard.jsx
  -------------------------------------------------
  A single-file React + Tailwind dashboard that contains
  components for all requested reports and a filter bar.

  Features:
  - Report selector (productSales, salesByCategory, salesByType, etc.)
  - Date range picker
  - Optional product/category/type input
  - Fetches from /api/reports (your controller) using query params
  - Shows summary card + chart + table breakdown
  - Uses Recharts for visualization

  How to use:
  1. Install deps: npm i react react-dom axios recharts
  2. Ensure Tailwind CSS is set up in your project.
  3. Place this file and import <ReportsDashboard /> into your app.

  Note: The component expects the backend route you created at GET /api/reports
  with query params: reportType, productId, categoryId, typeId, startDate, endDate
*/

const COLORS = ['#4f46e5', '#06b6d4', '#f97316', '#10b981', '#ef4444', '#8b5cf6'];

function SmallInput({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="flex flex-col text-sm">
      <span className="text-gray-600 text-xs mb-1">{label}</span>
      <input
        className="px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
    </label>
  )
}

function KpiCard({ title, value, sub }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {sub && <div className="text-sm text-gray-400 mt-1">{sub}</div>}
    </div>
  )
}

function DataTable({ columns, rows }) {
  return (
    <div className="overflow-auto bg-white rounded-2xl shadow">
      <table className="min-w-full divide-y">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c, i) => <th key={i} className="px-4 py-3 text-left text-xs font-medium text-gray-500">{c}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((r, ri) => (
            <tr key={ri} className="hover:bg-gray-50">
              {columns.map((c, ci) => (
                <td key={ci} className="px-4 py-3 text-sm text-gray-700">{r[c] ?? '-'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function SaleReports() {
  const [reportType, setReportType] = useState('productSales');
  const [productId, setProductId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [typeId, setTypeId] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date(); d.setMonth(d.getMonth() - 1); return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);

  const { allProducts } = useSelector((state) => state.saleItems);
  const categoryData = useSelector((state) => state.categories.categoryData); const typeData = useSelector((state) => state.types.typeData);

  async function fetchReport() {
    setLoading(true); setError(null);
    try {
      const params = { reportType, startDate, endDate };
      if (reportType === 'productSales' && productId) params.productId = productId;
      if (reportType === 'salesByCategory' && categoryId) params.categoryId = categoryId;
      if (reportType === 'salesByType' && typeId) params.typeId = typeId;

      // const res = await axios.get('/api/reports', { params });
      const res = await config.getReports(params)
      console.log('res', res)
      setReportData(res.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || 'Something went wrong');
    } finally { setLoading(false); }
  }

  useEffect(() => {
    // initial fetch
    fetchReport();
  }, [productId, categoryId, typeId]);

  // Helpers to shape data for charts/tables
  const chartData = useMemo(() => {
    if (!reportData) return [];
    if (reportType === 'productSales') {
      return [{ name: reportData.productName || 'Product', qty: reportData.totalQuantity || 0, revenue: reportData.totalRevenue || 0 }];
    }
    if (reportType === 'salesByCategory' || reportType === 'salesByType') {
      // summary only contains totals; optional: ask backend to return breakdown per product
      return [{ name: reportData.categoryName || reportData.typeName || 'Group', qty: reportData.totalQuantity || 0, revenue: reportData.totalRevenue || 0 }];
    }
    return [];
  }, [reportData, reportType]);

  const tableRows = useMemo(() => {
    if (!reportData) return [];
    if (reportType === 'productSales') {
      return [{ 'Product': reportData.productName, 'Qty Sold': reportData.totalQuantity, 'Revenue': reportData.totalRevenue }];
    }
    if (reportType === 'salesByCategory' || reportType === 'salesByType') {
      return [{ 'Group': reportData.categoryName || reportData.typeName, 'Qty Sold': reportData.totalQuantity, 'Revenue': reportData.totalRevenue }];
    }
    return [];
  }, [reportData, reportType]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Product Reports</h1>
            <p className="text-sm text-gray-500 mt-1">Generate sales & revenue reports by product, category or type.</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">Date Range</div>
            <div className="flex gap-2">
              <input type="date" className="px-3 py-2 rounded-lg border" value={startDate} onChange={e => setStartDate(e.target.value)} />
              <input type="date" className="px-3 py-2 rounded-lg border" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1 bg-white p-4 rounded-2xl shadow">
            <div className="text-sm text-gray-600 mb-3">Report</div>
            <select className="w-full px-3 py-2 border rounded" value={reportType} onChange={e => setReportType(e.target.value)}>
              <option value="productSales">Product Sales (single product)</option>
              <option value="salesByCategory">Sales by Category (single category)</option>
              <option value="salesByType">Sales by Type (single type)</option>
            </select>

           <div className="space-y-4">
      {reportType === "productSales" && (
        <SearchableDropdown
          label="Product"
          items={allProducts}
          displayKey="productName"
          onSelect={(p) => setProductId(p._id)}
        />
      )}

      {reportType === "salesByCategory" && (
        <SearchableDropdown
          label="Category"
          items={categoryData}
          displayKey="categoryName"
          onSelect={(c) => setCategoryId(c._id)}
        />
      )}

      {reportType === "salesByType" && (
        <SearchableDropdown
          label="Type"
          items={typeData}
          displayKey="typeName"
          onSelect={(t) => setTypeId(t._id)}
        />
      )}
    </div>
          </div>

          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <KpiCard title="Quantity Sold" value={reportData?.totalQuantity ?? 0} sub="Total units sold in range" />
            <KpiCard title="Revenue (computed)" value={reportData?.totalRevenue ? `Rs ${reportData?.totalRevenue}` : 'Rs 0'} sub={`Revenue for ${reportData?.productName}`} />
            <KpiCard title="Products in selection" value={reportType === 'productSales' ? (reportData?.productName ? 1 : 0) : '-'} sub={reportType === 'productSales' ? reportData?.productName : '—'} />
          </div>
        </div>

        {/* Charts + table */}
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow p-4">
            <h3 className="text-lg font-semibold mb-2">Visualization</h3>
            <div className="h-64">
              <ResponsiveContainer>
                {reportType === 'productSales' ? (
                  <BarChart data={chartData} margin={{ right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="qty" name="Quantity" fill="#4f46e5" />
                    <Bar dataKey="revenue" name="Revenue" fill="#10b981" />
                  </BarChart>
                ) : (
                  <PieChart>
                    <Pie data={chartData} dataKey={reportType === 'productSales' ? 'qty' : 'revenue'} nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {chartData.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-4">
            <h3 className="text-lg font-semibold mb-2">Breakdown</h3>
            <DataTable columns={Object.keys(tableRows[0] || {})} rows={tableRows} />
          </div>
        </div>

        <footer className="text-xs text-gray-400 text-center py-6">Reports Dashboard</footer>
      </div>
    </div>
  )
}
