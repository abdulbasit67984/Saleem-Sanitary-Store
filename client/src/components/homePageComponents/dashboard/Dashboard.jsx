/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { LineChart, Line, PieChart, Pie, BarChart, Bar, Tooltip, Legend, CartesianGrid, XAxis, YAxis, Cell, ResponsiveContainer } from "recharts";
import { FaChartLine, FaBox, FaDollarSign, FaStar } from "react-icons/fa";
import config from "../../../features/config";
import Loader from "../../../pages/Loader";
import functions from "../../../features/functions";

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [avgSales, setAvgSales] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [topProduct, setTopProduct] = useState("");
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch dashboard data from the backend
        const response = await config.getDashboardData();
        const {
          salesData,
          stockData,
          categoryData,
          totalSales,
          totalRevenue,
          avgSales,
          topProduct,
        } = response.data;

        const topStockData = stockData
          .sort((a, b) => b.value - a.value) // Sort in descending order by stock value
          .slice(0, 6);

        console.log('salesData', salesData)

        // Update state with fetched data
        setSalesData(salesData);
        setStockData(topStockData);
        setBarData(categoryData);
        setTotalSales(totalSales);
        setTotalRevenue(totalRevenue);
        setAvgSales(avgSales);
        setTopProduct(topProduct);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#B771E5", "#D84040"];

  return loading ?
    <Loader message="Loading Dashboard Data Please Wait...." mt="" h_w="h-10 w-10 border-t-2 border-b-2" />
    : (
      <div className="container mx-auto px-4 py-8">

        {/* KPI Cards - Modern Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Sales */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <FaChartLine className="text-blue-500 text-2xl" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-600">Total Sales</h2>
                <p className="text-2xl font-bold text-gray-800">{totalSales && functions.formatAsianNumber(totalSales)}</p>
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <FaDollarSign className="text-green-500 text-2xl" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-600">Total Revenue</h2>
                <p className="text-2xl font-bold text-gray-800">{totalRevenue && functions.formatAsianNumber(totalRevenue)}</p>
              </div>
            </div>
          </div>

          {/* Avg Sales */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaChartLine className="text-yellow-500 text-2xl" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-600">Avg Sales / Month</h2>
                <p className="text-2xl font-bold text-gray-800">{avgSales && functions.formatAsianNumber(avgSales)}</p>
              </div>
            </div>
          </div>

          {/* Top Product */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <FaStar className="text-purple-500 text-2xl" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-600">Top Product</h2>
                <p className="text-2xl font-bold text-gray-800">{topProduct}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section - Responsive and Modern */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sales Report */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Sales Report</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#A0C878" strokeWidth={2} />
                <Line type="monotone" dataKey="purchases" stroke="#D84040" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Stock Report */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Stock Report</h2>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie data={stockData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                  {stockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Report */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Category Report</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantity" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
};

export default Dashboard;