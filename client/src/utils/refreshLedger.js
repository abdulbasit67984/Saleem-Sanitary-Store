import config from "../features/config";

/**
 * Refresh ledger and account data after posting an entry or adjustment.
 *
 * @param {Function} setAccounts - React state setter for accounts.
 * @param {Function} setLedgerData - React state setter for ledger data.
 * @param {Function} setSelectedLedgerData - React state setter for filtered ledger data.
 * @param {Function} setSelectedAccount - React state setter for currently selected account.
 * @param {Object} selectedAccount - The currently selected account.
 */
export const refreshLedgerData = async ({
    setAccounts,
    setLedgerData,
    setSelectedLedgerData,
    setSelectedAccount,
    selectedAccount,
}) => {
    try {
        // Fetch all accounts again
        const accountsResponse = await config.getAccounts();
        if (!accountsResponse.data) throw new Error("Failed to reload accounts");

        setAccounts(accountsResponse.data);

        // Find updated selected account
        const updatedAccount = accountsResponse.data
            .flatMap(acc => acc.subCategories.flatMap(sub => sub.individualAccounts))
            .find(acc => acc._id === selectedAccount?._id);

        if (updatedAccount) {
            setSelectedAccount(updatedAccount);

            // Fetch ledger again
            const ledgerResponse = await config.getGeneralLedger();
            if (ledgerResponse.data) {
                const updatedLedger = ledgerResponse.data.filter(
                    entry =>
                        entry.referenceAccount._id === updatedAccount._id &&
                        entry.individualAccount.name !== "Sales Revenue"
                );

                // Cut off previous opening balance
                const lastOpeningIndex = updatedLedger
                    .map(entry => entry.details)
                    .lastIndexOf("Opening Balance");

                const finalFilteredEntries =
                    lastOpeningIndex !== -1
                        ? updatedLedger.slice(lastOpeningIndex)
                        : updatedLedger;

                setLedgerData(ledgerResponse.data);
                setSelectedLedgerData(finalFilteredEntries);
            }
        }
    } catch (err) {
        console.error("Error refreshing ledger:", err);
    }
};
