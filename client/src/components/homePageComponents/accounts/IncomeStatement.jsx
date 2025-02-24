import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import config from "../../../features/config";
import { useSelector } from "react-redux";

const IncomeStatement = () => {
  const [accounts, setAccounts] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const printRef = useRef();

  const userData = useSelector((state) => state.auth.userData)

  useEffect(() => {
    // Fetch account data
    const fetchAccounts = async () => {
      try {
        const response = await config.getAccounts();
        const data = response.data
        if (response && response.data)
          console.log('data', data)
        setAccounts(response.data);

        // Calculate totals
        let revenueTotal = 0;
        let expenseTotal = 0;

        data.forEach(account => {
          if (account.accountName === "Revenue") {
            account.subCategories.forEach(sub => {
              sub.individualAccounts.forEach(ind => {
                revenueTotal += ind.accountBalance;
              });
            });
          }
          if (account.accountName === "Expense") {
            account.subCategories.forEach(sub => {
              sub.individualAccounts.forEach(ind => {
                expenseTotal += ind.accountBalance;
              });
            });
          }
        });

        setTotalRevenue(revenueTotal);
        setTotalExpenses(expenseTotal);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, []);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Income Statement",
  });

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">

        <h2 className="text-xl font-bold">Income Statement</h2>
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Print
        </button>
      </div>
      
      <div className="max-h-96 overflow-auto scrollbar-thin">
        <div ref={printRef} className="p-6 border border-gray-300 bg-gray-50 rounded-md ">
          <h1 className=" font-bold text-center mb-4">
            {userData.BusinessId?.businessName}
          </h1>
          <h2 className=" font-bold text-center mb-4">Income Statement</h2>
          <h3 className="  text-center mb-4">
            {new Date().toLocaleDateString()}
          </h3>

          <div className="mb-4">
            <h3 className=" font-semibold border-b pb-2">Revenue</h3>
            <ul>
              {accounts
                .filter(acc => acc.accountName === "Revenue")
                .flatMap(acc => acc.subCategories)
                .flatMap(sub => sub.individualAccounts)
                .map(ind => (
                  <li key={ind._id} className="flex justify-between px-4 py-2 text-sm">
                    <span>{ind.individualAccountName}</span>
                    <span>{ind.accountBalance.toFixed(2)}</span>
                  </li>
                ))}
            </ul>
          </div>

          <div className="mb-4">
            <h3 className=" font-semibold border-b pb-2">Expenses</h3>
            <ul>
              {accounts
                .filter(acc => acc.accountName === "Expense")
                .flatMap(acc => acc.subCategories)
                .flatMap(sub => sub.individualAccounts)
                .map(ind => (
                  <li key={ind._id} className="flex justify-between px-4 py-2 text-sm">
                    <span>{ind.individualAccountName}</span>
                    <span>-{ind.accountBalance.toFixed(2)}</span>
                  </li>
                ))}
            </ul>
          </div>

          <div className="mt-4 font-bold text-lg text-right">
            <span className={`${(totalRevenue-totalExpenses) > 0 ? 'text-green-600' : 'text-red-500'}`}>Net Income: {totalRevenue - totalExpenses}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeStatement;
