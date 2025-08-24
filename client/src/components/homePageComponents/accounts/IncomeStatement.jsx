import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import config from "../../../features/config";

export default function IncomeStatement() {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

  const [data, setData] = useState(null);
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await config.getIncomeStatement(
        `startDate=${fromDate}&endDate=${toDate}`
      );

      if (res) {
        setData(res.data);
      } else {
        setError("No data available for the selected range.");
        setData(null);
      }
    } catch (err) {
      console.error("Error fetching income statement:", err);
      setError("Failed to fetch income statement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fromDate, toDate]);

  const exportToCSV = () => {
    if (!data) return;

    let csv = "Section,Account,Amount\n";

    // Revenue
    csv += `Revenue,Total Revenue,${data.revenue}\n`;

    // Expenses
    data.expenses.forEach((exp) => {
      csv += `Expense,${exp.accountName},${exp.totalExpense}\n`;
    });
    csv += `Expense,Total Expenses,${data.totalExpenses}\n`;

    // Net Profit
    csv += `Net Profit,,${data.netProfit}\n`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `income_statement_${fromDate}_to_${toDate}.csv`);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h2 className="text-xl font-semibold">Income Statement</h2>
        <div className="flex items-center gap-2">
          <div>
            <label className="text-sm">From:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="ml-1 px-2 py-1 border rounded"
            />
          </div>
          <div>
            <label className="text-sm">To:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="ml-1 px-2 py-1 border rounded"
            />
          </div>

          <button
            className="px-4 py-1 rounded bg-green-600 text-white"
            onClick={exportToCSV}
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        data && (
          <div>
            {/* Revenue */}
            <div className="mb-6">
              <h3 className="text-lg font-medium">Revenue</h3>
              <p className="text-green-600 font-bold text-lg">
                Rs. {data.revenue.toLocaleString()}
              </p>
            </div>

            {/* Expenses */}
            <div className="mb-6">
              <h3 className="text-lg font-medium">Expenses</h3>
              <table className="w-full text-sm mt-2 border border-gray-300 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2 border">Account</th>
                    <th className="p-2 border">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.expenses.length > 0 ? (
                    data.expenses.map((exp) => (
                      <tr key={exp.accountId}>
                        <td className="p-2 border">{exp.accountName}</td>
                        <td className="p-2 border">
                          Rs. {exp.totalExpense.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="p-2 text-center">
                        No expenses found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <p className="mt-2 font-semibold">
                Total Expenses: Rs. {data.totalExpenses.toLocaleString()}
              </p>
            </div>

            {/* Net Profit */}
            <div>
              <h3 className="text-lg font-medium">Net Profit</h3>
              <p
                className={`font-bold text-lg ${
                  data.netProfit >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                Rs. {data.netProfit.toLocaleString()}
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
}
