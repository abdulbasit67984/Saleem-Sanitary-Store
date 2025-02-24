import { Router } from "express";
import { registerAccount, updateAccount, getAccounts,registerSubAccount, updateSubAccount, registerIndividualAccount, updateIndividualAccount, getAccountReceivables, getIndividualAccounts, postExpense, postVendorJournalEntry, getGeneralLedger, postCustomerJournalEntry } from "../controllers/account.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();


//secure routes
router.route("/add-account").post(verifyJWT, registerAccount)
router.route("/get-accounts").get(verifyJWT, getAccounts)
router.route("/update-account").patch(verifyJWT, updateAccount)

router.route("/add-subCategory").post(verifyJWT, registerSubAccount)
router.route("/update-subCategory").patch(verifyJWT, updateSubAccount)

router.route("/add-individualAccount").post(verifyJWT, registerIndividualAccount)
router.route("/update-individualAccount").patch(verifyJWT, updateIndividualAccount)
router.route("/get-individualAccounts").get(verifyJWT, getIndividualAccounts)

router.route("/get-accountReceivables").get(verifyJWT, getAccountReceivables)

router.route("/post-expense").post(verifyJWT, postExpense)
router.route("/post-vendorEntry").post(verifyJWT, postVendorJournalEntry)
router.route("/post-customerEntry").post(verifyJWT, postCustomerJournalEntry)

router.route("/get-generalLedgers").get(verifyJWT, getGeneralLedger)


export  { router as accountRoutes};