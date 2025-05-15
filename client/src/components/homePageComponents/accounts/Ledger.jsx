import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import config from "../../../features/config"; // Ensure API service import
import { useSelector } from "react-redux";
import Loader from "../../../pages/Loader";
import functions from "../../../features/functions"

const Ledger = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [ledgerData, setLedgerData] = useState([]);
  const [selectedLedgerData, setSelectedLedgerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const printRef = useRef();

  let balance = 0;

  const userData = useSelector((state) => state.auth.userData)

  // Fetch accounts and GL data inside the component
  useEffect(() => {

    const fetchAccountsAndLedger = async () => {
      try {
        setLoading(true);

        // Fetch accounts
        const accountsResponse = await config.getAccounts();
        if (accountsResponse.data) {
          setAccounts(accountsResponse.data);
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
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccountsAndLedger();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredAccounts = accounts.flatMap(account =>
    account.subCategories.flatMap(sub =>
      sub.individualAccounts.filter(individual =>
        individual.individualAccountName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  );

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
    <div className="p-3 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">General Ledger</h1>

      {loading && <Loader h_w='h-16 w-16 border-t-4 border-b-4' message='Loading please Wait...' />}
      {error && <p className="text-red-500">{error}</p>}

      {/* Account List */}
      {!selectedAccount && (
        <div className="bg-gray-50 p-3 max-h-96 overflow-auto scrollbar-track-gray-700 scrollbar-thin ">
          <input
            type="text"
            placeholder="Search Accounts..."
            className="border p-2 rounded text-sm w-full mb-4"
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredAccounts.map(individual => (
              <div
                key={individual._id}
                className={` ${individual.customerId && 'bg-green-200'} ${(individual.supplierId || individual.companyId) && 'bg-red-200'} p-4 rounded shadow-md cursor-pointer hover:shadow-lg transition`}
                onClick={() => handleSelectAccount(individual)}
              >
                <h2 className="text-lg font-semibold">{individual.individualAccountName}</h2>
                <p className="text-gray-600">Balance: {individual.accountBalance}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* General Ledger Full-Screen View */}
      {selectedAccount && (
        <div className=" w-full h-full bg-white shadow-lg flex flex-col p-6 max-h-96 scrollbar-thin overflow-auto">
          {/* Close Button */}
          <div className="flex justify-end gap-2">
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
                      <td className="p-2">{entry.debit && functions.formatAsianNumber(entry.debit)}</td>
                      <td className="p-2">{entry.credit && functions.formatAsianNumber(entry.credit)}</td>
                      <td className="p-2">{entryBalance && functions.formatAsianNumber(entryBalance)}</td>
                    </tr>
                  )})}
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

          {/* Print & Save as PDF Buttons */}

        </div>
      )}
    </div>
  );
};

export default Ledger;
