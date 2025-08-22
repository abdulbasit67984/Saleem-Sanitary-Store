import React, { useEffect, useState } from "react";
import { LineChart, Line, PieChart, Pie, BarChart, Bar, Tooltip, Legend, CartesianGrid, XAxis, YAxis, Cell, ResponsiveContainer } from "recharts";
import config from "../../../features/config";
import Loader from "../../../pages/Loader";
import functions from "../../../features/functions";

const Dashboard = () => {
  const [filter, setFilter] = useState("monthly"); // default filter
  const [salesData, setSalesData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [avgSales, setAvgSales] = useState(0);
  const [topProduct, setTopProduct] = useState({});
  const [leastProduct, setLeastProduct] = useState("");
  const [outOfStock, setOutOfStock] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async (selectedFilter = "monthly") => {
    setLoading(true);
    try {
      const response = await config.getDashboardData(selectedFilter);
      const {
        salesData,
        stockData,
        categoryData,
        totalSales,
        totalRevenue,
        avgSales,
        topProduct,
        leastProduct,
        outOfStock
      } = response.data;

      setSalesData(salesData);
      setStockData(stockData);
      setBarData(categoryData);
      setTotalSales(totalSales);
      setTotalRevenue(totalRevenue);
      setAvgSales(avgSales);
      setTopProduct(topProduct || "N/A");
      setLeastProduct(leastProduct || "N/A");
      setOutOfStock(outOfStock || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(filter);
  }, [filter]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#B771E5", "#D84040", "#78C841", "#FF9B2F", "#B4E50D", "#FB4141"];

  return loading ? (
    <Loader message="Loading Dashboard Data Please Wait..." mt="" h_w="h-10 w-10 border-t-2 border-b-2" />
  ) : (
    <div className="container mx-auto px-4 py-8 overflow-y-auto">
      {/* Filter Dropdown */}
      <div className="mb-6">
        <label className="mr-2 font-semibold text-sm">Select Filter:</label>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="6months">Last 6 Months</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Sales */}
        <KPI title="Total Sales" value={functions.formatAsianNumber(totalSales)} color="blue" />
        <KPI title="Total Revenue" value={functions.formatAsianNumber(totalRevenue)} color="green" />
        <KPI title="Avg Sales" value={functions.formatAsianNumber(avgSales)} color="yellow" />
        <KPI title="Top Product" value={`${topProduct?.productName}`} color="purple" />
      </div>


      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <ChartCard title="Sales Report">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#A0C878" strokeWidth={2} />
              <Line type="monotone" dataKey="purchases" stroke="#D84040" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Stock Pie */}
        <ChartCard title="Stock Report">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip />
              {/* <Legend /> */}
              <Pie data={stockData} dataKey="totalQuantity" nameKey="productName" cx="50%" cy="50%" outerRadius={100} label>
                {stockData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Category Chart */}
        <ChartCard title="Category Report">
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
        </ChartCard>
      </div>

      {/* Additional KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
        <KPI title="Least Sold Product" value={leastProduct?.productName} color="red" />
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Out of Stock Products</h2>
          <ol className="text-sm text-gray-700  pl-5 max-h-32 overflow-y-auto">
            {outOfStock.length > 0 ? (
              outOfStock?.map((item, i) => <li key={i}>{item.productName}</li>)
            ) : (
              <li>No products are out of stock</li>
            )}
          </ol>
        </div>
      </div>
    </div>
  );
};

// Reusable KPI component
const KPI = ({ title, value, color }) => (
  <div className={`bg-white p-6 rounded-lg shadow-lg`}>
    <h2 className="text-sm font-semibold text-gray-600">{title}</h2>
    <p className={`text-2xl font-bold text-${color}-800`}>{value}</p>
  </div>
);

// Reusable Chart Card component
const ChartCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
    {children}
  </div>
);

export default Dashboard;
