import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  Tooltip,
  Legend,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  TrendingUp,
  DollarSign,
  Package,
  AlertOctagon,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  Activity,
  Award
} from "lucide-react";
import config from "../../../features/config";

// --- Mocks & Helpers for Preview (Replacing external imports) ---

const functions = {
  formatAsianNumber: (value) => {
    if (!value) return "0";
    return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(value);
  }
};

const Loader = ({ message, h_w }) => (
  <div className="flex flex-col items-center justify-center gap-4">
    <div className={`${h_w || "w-10 h-10"} border-blue-500 border-t-transparent rounded-full animate-spin`} />
    <p className="text-slate-400 text-sm animate-pulse">{message}</p>
  </div>
);

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#6366F1", "#14B8A6"];

// --- Helper for GMT+5 (Pakistan) Date Formatting ---
const formatToPKT = (dateStr) => {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-PK", {
      timeZone: "Asia/Karachi",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch (e) {
    return dateStr;
  }
};

const Dashboard = () => {
  const [filter, setFilter] = useState("monthly");
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
        outOfStock,
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

  // --- Custom Components ---

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-2xl">
          <p className="text-slate-300 text-sm mb-2">{formatToPKT(label) || label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm font-medium">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-white">
                {entry.name}:{" "}
                <span className="text-emerald-400">
                  {functions.formatAsianNumber(entry.value)}
                </span>
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-white">
        <Loader message="Analyzing Dashboard Data..." h_w="h-16 w-16 border-4" />
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-white via-primary to-primary text-slate-100 p-4 md:p-8 font-sans selection:bg-blue-500/30"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-primary">
             Dashboard Analytics
          </h1>
          <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            Real-time business insights & analytics
          </p>
        </div>

        {/* Styled Filter */}
        <div className="relative group">
          <div className="absolute inset-0  blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center bg-primary rounded-xl px-4 py-2 transition-colors">
            <Calendar className="w-4 h-4 text-white mr-2" />
            <select
              className="bg-transparent !bg-transparent text-sm font-medium focus:outline-none appearance-none cursor-pointer pr-8 text-white !text-white"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="daily" className="bg-white text-slate-900">Daily</option>
              <option value="weekly" className="bg-white text-slate-900">Weekly</option>
              <option value="monthly" className="bg-white text-slate-900">Monthly</option>
              <option value="6months" className="bg-white text-slate-900">6 Months</option>
              <option value="yearly" className="bg-white text-slate-900">Yearly</option>
            </select>
            <ChevronDown className="w-4 h-4 text-white absolute right-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Sales"
          value={functions.formatAsianNumber(totalSales)}
          icon={TrendingUp}
          color="blue"
          trend="up"
        />
        <KPICard
          title="Total Revenue"
          value={functions.formatAsianNumber(totalRevenue)}
          icon={DollarSign}
          color="emerald"
          trend="up"
        />
        <KPICard
          title="Avg Sales"
          value={functions.formatAsianNumber(avgSales)}
          icon={Activity}
          color="amber"
          trend="neutral"
        />
        <KPICard
          title="Top Performer"
          value={topProduct?.productName || "N/A"}
          icon={Award}
          color="purple"
          isText={true}
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sales Trend (Spans 2 columns) */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl hover:shadow-blue-900/10 transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full" />
              Sales vs Purchases Trend
            </h2>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Sales
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-red-500" /> Purchases
              </span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPurchases" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatToPKT}
                  stroke="#475569"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#475569"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#475569", strokeWidth: 1, strokeDasharray: "4 4" }} />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
                <Area
                  type="monotone"
                  dataKey="purchases"
                  stroke="#EF4444"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorPurchases)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Products Pie (1 column) */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -z-10" />
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-purple-500 rounded-full" />
            Top Sold Products
          </h2>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={stockData}
                  dataKey="totalQuantity"
                  nameKey="productName"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                >
                  {stockData?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="rgba(0,0,0,0)"
                    />
                  ))}
                </Pie>
                {/* <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ paddingTop: "20px", fontSize: "12px" }} 
                /> */}
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Secondary Charts & Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Category Bar Chart */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-xl"
        >
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
             <span className="w-1 h-6 bg-emerald-500 rounded-full" />
             Category Distribution
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="category"
                  stroke="#475569"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#475569"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#1e293b", opacity: 0.4 }} />
                <Bar dataKey="quantity" radius={[4, 4, 0, 0]}>
                   {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#10B981" : "#34D399"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Action Items / Alerts Column */}
        <div className="flex flex-col gap-6">
          {/* Least Sold */}
          <motion.div
            variants={itemVariants}
            className="flex-1 bg-gradient-to-br from-red-900/20 to-slate-900 border border-red-500/20 p-6 rounded-3xl relative overflow-hidden group"
          >
             <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-500/20 rounded-full blur-2xl group-hover:bg-red-500/30 transition-colors" />
             <div className="flex items-start justify-between">
                <div>
                   <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Attention Needed</h3>
                   <h2 className="text-xl font-bold text-white mt-1">Least Sold Item</h2>
                </div>
                <div className="p-3 bg-red-500/10 rounded-xl">
                   <ArrowDownRight className="w-6 h-6 text-red-500" />
                </div>
             </div>
             <div className="mt-8">
                <p className="text-3xl font-bold text-white tracking-tight">
                   {leastProduct?.productName || "N/A"}
                </p>
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                   Review pricing or promotion strategy
                </p>
             </div>
          </motion.div>

          {/* Out of Stock List */}
          <motion.div
            variants={itemVariants}
            className="flex-[2] bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl flex flex-col"
          >
             <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                   <AlertOctagon className="w-5 h-5 text-amber-500" />
                   Low Stock Alerts
                </h2>
                <span className="bg-amber-500/10 text-amber-500 px-2 py-1 rounded-lg text-xs font-bold border border-amber-500/20">
                   {outOfStock.length} Items
                </span>
             </div>
             
             <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 max-h-[200px]">
                {outOfStock.length > 0 ? (
                   <ul className="space-y-3">
                      {outOfStock.map((item, i) => (
                         <li key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-amber-500/50 transition-colors">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center">
                                  <Package className="w-4 h-4 text-slate-400" />
                               </div>
                               <span className="text-sm font-medium text-slate-200">{item.productName}</span>
                            </div>
                            <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded-md">
                               Empty
                            </span>
                         </li>
                      ))}
                   </ul>
                ) : (
                   <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                      <Package className="w-8 h-8 opacity-50" />
                      <span className="text-sm">Stock levels are healthy</span>
                   </div>
                )}
             </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Reusable Modern KPI Card ---
const KPICard = ({ title, value, icon: Icon, color, isText, trend }) => {
  const colorMap = {
    blue: "from-blue-500 to-cyan-400",
    emerald: "from-emerald-500 to-teal-400",
    amber: "from-amber-500 to-orange-400",
    purple: "from-purple-500 to-pink-400",
    red: "from-red-500 to-rose-400",
  };

  const bgMap = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5 }}
      className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl shadow-lg relative overflow-hidden group"
    >
      {/* Background Glow */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${colorMap[color]} group-hover:opacity-30 transition-opacity`} />
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-slate-200 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
          <h3 className={`font-bold text-white ${isText ? "text-xl leading-tight" : "text-3xl"}`}>
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-2xl border ${bgMap[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

    </motion.div>
  );
};

export default Dashboard;