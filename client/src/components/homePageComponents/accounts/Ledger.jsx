/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import config from "../../../features/config"; // Ensure API service import
import { useSelector } from "react-redux";
import Loader from "../../../pages/Loader";
import functions from "../../../features/functions"
import JournalEntryModal from "./JournalEntryModal.jsx";

import { refreshLedgerData } from "../../../utils/refreshLedger.js";
import Input from "../../Input.jsx";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { motion } from "framer-motion";

const Ledger = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [ledgerData, setLedgerData] = useState([]);
  const [selectedLedgerData, setSelectedLedgerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalPayAndRec, setTotalPayAndRec] = useState({});

  const [accountTypeFilter, setAccountTypeFilter] = useState("all");
  const [balanceTypeFilter, setBalanceTypeFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [sortOrder, setSortOrder] = useState("none");

  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustFormData, setAdjustFormData] = useState({ reason: '', debit: 0, credit: 0 });
  const [adjustLoading, setAdjustLoading] = useState(false);
  const [adjustError, setAdjustError] = useState(null);
  const [adjustSuccess, setAdjustSuccess] = useState(null);



  const [showJournalModal, setShowJournalModal] = useState(false);
  const [journalAccount, setJournalAccount] = useState(null);

  const [accountBalances, setAccountBalances] = useState({});

  const handleOpenModal = (type, account) => {
    if (type === 'journal') {
      setJournalAccount(account);
      setShowJournalModal(true);
    }
  };


  const printRef = useRef();

  let balance = 0;

  const userData = useSelector((state) => state.auth.userData)

  const fetchAccountsAndLedger = async () => {
    try {
      setLoading(true);

      // Fetch accounts
      const accountsResponse = await config.getAccounts();
      if (accountsResponse.data) {
        setAccounts(accountsResponse.data);
        setLoading(false);

      } else {
        setError("No accounts found.");
      }

      // Fetch General Ledger Data
      const ledgerResponse = await config.getGeneralLedger();
      if (ledgerResponse.data) {
        setLedgerData(ledgerResponse.data);
      } else {
        setError("No ledger data found.");
      }
      return { accounts: accountsResponse.data, ledger: ledgerResponse.data };
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch accounts and GL data inside the component
  useEffect(() => {



    fetchAccountsAndLedger();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredAccounts = accounts.flatMap(account =>
    account.subCategories.flatMap(sub =>
      sub.individualAccounts.filter(individual => {
        const nameMatch = individual.individualAccountName.toLowerCase().includes(searchTerm.toLowerCase());
        const regionMatch = regionFilter ? (individual.customerRegion?.toLowerCase().includes(regionFilter.toLowerCase())) : true;

        const isCustomer = !!individual.customerId;
        const isSupplier = !!individual.supplierId;
        const isCompany = !!individual.companyId;

        const accountTypeMatch =
          accountTypeFilter === "all" ||
          (accountTypeFilter === "customer" && isCustomer) ||
          (accountTypeFilter === "supplier" && isSupplier) ||
          (accountTypeFilter === "company" && isCompany) ||
          (accountTypeFilter === "others" && !isCustomer && !isSupplier && !isCompany);

        const balanceMatch =
          balanceTypeFilter === "all" ||
          (balanceTypeFilter === "positive" && individual.accountBalance > 0) ||
          (balanceTypeFilter === "negative" && individual.accountBalance < 0) ||
          (balanceTypeFilter === "zero" && individual.accountBalance === 0);

        return nameMatch && accountTypeMatch && balanceMatch && regionMatch;
      })
    )
  );

  const getComputedBalance = (individual) => {
    const computed = accountBalances[individual._id];
    // if computed is undefined, fall back to the server value or 0
    return typeof computed === "number" ? computed : 0;
  };

  if (sortOrder === "asc") {
    filteredAccounts.sort((a, b) => getComputedBalance(a) - getComputedBalance(b));
  } else if (sortOrder === "desc") {
    filteredAccounts.sort((a, b) => getComputedBalance(b) - getComputedBalance(a));
  }


  // Handle selecting an account
  const handleSelectAccount = (account) => {
    setSelectedAccount(account);

    // Filter ledger entries for the selected account
    const filteredEntries = ledgerData.filter(
      (entry) =>
        entry.referenceAccount._id === account._id &&
        entry.individualAccount.name !== "Sales Revenue"
    );

    // Find the last "Opening Balance" entry
    const lastOpeningIndex = filteredEntries
      .map((entry) => entry.details)
      .lastIndexOf("Opening Balance");

    // Keep only entries up to (and including) the last "Opening Balance"
    const finalFilteredEntries =
      lastOpeningIndex !== -1
        ? filteredEntries.slice(lastOpeningIndex)
        : filteredEntries;

    console.log("Filtered Entries:", finalFilteredEntries);
    setSelectedLedgerData(finalFilteredEntries);
  };


  // Handle closing the General Ledger view
  const handleCloseLedger = () => {
    setSelectedAccount(null);
  };

  const handleAdjustChange = (e) => {
    const { name, value } = e.target;
    setAdjustFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();

    if (adjustFormData.debit && adjustFormData.credit) {
      setAdjustError("Please fill only one field: either Debit or Credit.");
      return;
    }

    if (!adjustFormData.debit && !adjustFormData.credit) {
      setAdjustError("Please enter a value in either Debit or Credit.");
      return;
    }

    setAdjustLoading(true);
    setAdjustError(null);
    setAdjustSuccess(null);



    try {
      const response = await config.openCloseAccountBalance({
        endpoint: 'adjust-account-balance',
        formData: {
          accountId: selectedAccount._id,
          ...adjustFormData
        }
      });

      if (response?.data) {
        setAdjustSuccess(response.data.message || "Balance adjusted successfully");
        setTimeout(() => {
          setAdjustSuccess(null)
        }, 3000);

        // await fetchAccountsAndLedger();
        // setTimeout(() => {
        //   const updatedAccount = accounts
        //     .flatMap(acc => acc.subCategories.flatMap(sub => sub.individualAccounts))
        //     .find(a => a._id === selectedAccount._id);

        //   if (updatedAccount) handleSelectAccount(updatedAccount);
        // }, 300);


        // Inside handleAdjustSubmit
        await refreshLedgerData({
          setAccounts,
          setLedgerData,
          setSelectedLedgerData,
          setSelectedAccount,
          selectedAccount,
        });


        setAdjustFormData({ reason: "", debit: 0, credit: 0 });
        setShowAdjustModal(false);
        setAdjustSuccess("Balance adjusted successfully");
        setTimeout(() => setAdjustSuccess(null), 3000);

      }
    } catch (err) {
      setAdjustError(err.response?.data?.message || "Failed to adjust balance");
    } finally {
      setAdjustLoading(false);
    }
  };

  const filterLedgerEntries = (account, allData) => {
    const filteredEntries = allData.filter(
      (entry) =>
        entry.referenceAccount._id === account._id &&
        entry.individualAccount.name !== "Sales Revenue"
    );

    const lastOpeningIndex = filteredEntries
      .map((entry) => entry.details)
      .lastIndexOf("Opening Balance");

    const finalEntries =
      lastOpeningIndex !== -1
        ? filteredEntries.slice(lastOpeningIndex)
        : filteredEntries;

    setSelectedLedgerData(finalEntries);
  };

  const handleJournalEntrySuccess = async () => {
    setShowJournalModal(false);
    const { accounts: updatedAccounts, ledger: updatedLedger } = await fetchAccountsAndLedger();

    // Update state with the new data
    setAccounts(updatedAccounts);
    setLedgerData(updatedLedger);

    // Refresh the selected account and its ledger
    if (selectedAccount) {
      filterLedgerEntries(selectedAccount, updatedLedger);
    }
  };

  // Compute balances from ledgerData: sum(debit) - sum(credit) per referenceAccount._id
  const computeBalances = (ledgerEntries) => {
    const map = {};

    if (!Array.isArray(ledgerEntries)) return map;

    // Group entries by account first
    const grouped = {};

    for (const entry of ledgerEntries) {
      const id = entry?.referenceAccount?._id;
      if (!id) continue;

      // Ignore Sales Revenue (same rule as inside GL)
      if (entry.individualAccount?.name === "Sales Revenue") continue;

      if (!grouped[id]) grouped[id] = [];
      grouped[id].push(entry);
    }

    // Now compute balance PER ACCOUNT using same GL logic
    Object.keys(grouped).forEach((id) => {
      const entries = grouped[id];

      // cut up to last Opening Balance
      const lastOpeningIndex = entries
        .map((e) => e.details)
        .lastIndexOf("Opening Balance");

      const filtered =
        lastOpeningIndex !== -1 ? entries.slice(lastOpeningIndex) : entries;

      // now compute debit - credit
      let balance = 0;

      for (const e of filtered) {
        balance += Number(e.debit || 0);
        balance -= Number(e.credit || 0);
      }

      map[id] = balance;
    });

    return map;
  };

  const totalPayablesAndReceivables = () => {

    let totalReceivables = 0;
    let totalPayables = 0;

    accounts.flatMap(account =>
      account.subCategories.flatMap(sub =>
        sub.individualAccounts.filter(individual => {
          // console.log('individual', individual)
          if ((individual.customerId) && (individual.mergedInto === null)) totalReceivables += getComputedBalance(individual);
          if ((individual.supplierId || individual.companyId) && individual.mergedInto === null) totalPayables += getComputedBalance(individual);
        })
      )
    )

    return {
      totalReceivables,
      totalPayables
    }
  }


  // Recompute balances whenever ledgerData changes
  useEffect(() => {
    const map = computeBalances(ledgerData);
    setAccountBalances(map);
    const totalRecAndPay = totalPayablesAndReceivables()
    setTotalPayAndRec(totalRecAndPay)
  }, [ledgerData]);



  // Print functionality
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  // Save as PDF functionality (captures full UI)
  const handleSaveAsPDF = () => {
    if (!selectedAccount) return;

    html2canvas(printRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 200;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 5, 1, imgWidth, imgHeight);
      pdf.save(`${selectedAccount.individualAccountName}_GeneralLedger.pdf`);
    });
  };

  return (
    <div className=" bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">General Ledger</h1>

        {
          !selectedAccount && (
            <div className="flex gap-3">
              {/* Receivables */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="rounded-2xl shadow-md bg-white border p-4 flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-100">
                    <ArrowDownCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Receivables</p>
                    <p className="text-xl font-semibold">
                      {functions.formatAsianNumber(totalPayAndRec?.totalReceivables)}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Payables */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="rounded-2xl shadow-md bg-white border p-4 flex items-center gap-3">
                  <div className="p-2 rounded-full bg-red-100">
                    <ArrowUpCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Payables</p>
                    <p className="text-xl font-semibold">
                      {functions.formatAsianNumber(totalPayAndRec?.totalPayables)}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )
        }
      </div>

      {loading && <Loader h_w='h-16 w-16 border-t-4 border-b-4' message='Loading please Wait...' />}
      {error && <p className="text-red-500">{error}</p>}

      {/* Adjust Balance Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowAdjustModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4">Adjust Account Balance</h2>

            {adjustError && <p className="text-red-500 text-sm mb-2">{adjustError}</p>}
            {adjustSuccess && <p className="text-green-600 text-sm mb-2">{adjustSuccess}</p>}

            <form onSubmit={handleAdjustSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Debit</label>
                <input
                  type="number"
                  name="debit"
                  value={adjustFormData.debit}
                  onChange={handleAdjustChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Credit</label>
                <input
                  type="number"
                  name="credit"
                  value={adjustFormData.credit}
                  onChange={handleAdjustChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <input
                  type="text"
                  name="reason"
                  value={adjustFormData.reason}
                  onChange={handleAdjustChange}
                  placeholder="Enter reason for adjustment"
                  className="w-full border p-2 rounded"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjustLoading}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  {adjustLoading ? "Adjusting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Account List */}
      {!selectedAccount && (
        <div className="bg-gray-50 p-3 max-h-96 overflow-auto scrollbar-track-gray-700 scrollbar-thin ">
          <div className="bg-white p-3 mb-4 rounded-md shadow flex flex-wrap gap-3 items-center justify-between sticky -top-3">
            {/* Search by name */}
            <input
              type="text"
              placeholder="Search Accounts..."
              className="border border-gray-300 p-2 rounded text-sm w-48 focus:ring-1 focus:ring-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Account Type */}
            <select
              className="border border-gray-300 p-2 rounded text-sm focus:ring-1 focus:ring-gray-400"
              value={accountTypeFilter}
              onChange={(e) => setAccountTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="customer">Customers</option>
              <option value="supplier">Suppliers</option>
              <option value="company">Companies</option>
              <option value="others">Others</option>
            </select>

            {/* Balance Filter */}
            <select
              className="border border-gray-300 p-2 rounded text-sm focus:ring-1 focus:ring-gray-400"
              value={balanceTypeFilter}
              onChange={(e) => setBalanceTypeFilter(e.target.value)}
            >
              <option value="all">All Balances</option>
              <option value="positive">Positive Balance</option>
              <option value="negative">Negative Balance</option>
              <option value="zero">Zero Balance</option>
            </select>

            {/* Region Filter */}
            <select
              className="border p-2 rounded text-sm w-full sm:w-1/3"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="none">Sort by Balance</option>
              <option value="asc">Lowest to Highest</option>
              <option value="desc">Highest to Lowest</option>
            </select>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setAccountTypeFilter('all');
                setBalanceTypeFilter('all');
                setRegionFilter('');
              }}
              className="text-sm text-red-600 hover:underline"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredAccounts.map(individual => {

              return (!individual.mergedInto) ? (
                <div key={individual._id}
                  className={` ${individual.customerId && 'bg-green-200'} ${(individual.supplierId || individual.companyId) && 'bg-red-200'} p-4 rounded shadow-md cursor-pointer hover:shadow-lg transition`}
                  onClick={() => handleSelectAccount(individual)}
                >
                  <h2 className="text-lg font-semibold">{individual.individualAccountName}</h2>
                  <p className="text-gray-600">Balance: {functions.formatAsianNumber(getComputedBalance(individual))}</p>
                </div>) : null
            })}
          </div>
        </div>
      )}

      {/* General Ledger Full-Screen View */}
      {selectedAccount && (
        <div className=" w-full h-full bg-white shadow-lg flex flex-col p-6 max-h-96 scrollbar-thin overflow-auto">
          {/* Close Button */}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleOpenModal('journal', selectedAccount)}
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add Journal Entry
            </button>
            <button
              onClick={() => setShowAdjustModal(true)}
              className="border border-yellow-500 text-yellow-500 px-4 py-2 rounded hover:bg-yellow-500 hover:text-white"
            >
              Adjust Balance
            </button>
            <button
              onClick={handlePrint}
              className=" border border-blue-500 hover:text-white text-blue-500 px-2  py-0 rounded-md hover:bg-blue-600"
            >
              Print
            </button>
            <button
              onClick={handleSaveAsPDF}
              className="hover:bg-green-500 border border-green-500 text-green-500 px-4 py-2 rounded hover:text-white"
            >
              Save as PDF
            </button>
            <button
              onClick={handleCloseLedger}
              className="  bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>

          <div className="flex flex-col py-7" ref={printRef}>
            <h1 className="font-sans font-bold">{userData.BusinessId.businessName}</h1>
            <h2 className=" ">{selectedAccount.individualAccountName} - General Ledger</h2>

            {/* Ledger Table */}
            <div className="w-full overflow-x-auto mt-6">
              <table className="w-full text-xs border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="border p-2">Date</th>
                    <th className="border p-2">Detail</th>
                    <th className="border p-2">Description</th>
                    <th className="border p-2">Debit</th>
                    <th className="border p-2">Credit</th>
                    <th className="border p-2">balance</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedLedgerData.map(entry => {
                    if (entry.debit) {
                      balance += parseInt(entry.debit || 0);
                    } else if (entry.credit) {
                      balance -= parseInt(entry.credit || 0);
                    }

                    // Now assign the updated balance to this row
                    const entryBalance = balance;
                    return (
                      <tr key={entry._id} className="border">
                        <td className="p-2">{entry.createdAt.slice(0, 10)}</td>
                        <td className="p-2">{entry.details}</td>
                        <td className="p-2">{entry.description}</td>
                        <td className="p-2">{(entry.debit && entry.debit !== 0) ? functions.formatAsianNumber(entry.debit) : ''}</td>
                        <td className="p-2">{(entry.credit && entry.credit !== 0) ? functions.formatAsianNumber(entry.credit) : ''}</td>
                        <td className="p-2">{entryBalance && functions.formatAsianNumber(entryBalance)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end">
              <div className="p-4">
                <h3 className="p-2 border font-semibold text-xs mr-20">Total Balance: {balance && functions.formatAsianNumber(balance)}</h3>

              </div>
            </div>
            <p className='text-center text-[10px] mt-4'>Software by Pandas. 📞 03103480229 🌐 www.pandas.com.pk</p>
          </div>


        </div>
      )}

      {showJournalModal && selectedAccount && (
        <JournalEntryModal
          account={selectedAccount}
          onClose={() => setShowJournalModal(false)}
          onSuccess={handleJournalEntrySuccess}
        />
      )}

    </div>
  );
};

export default Ledger;
