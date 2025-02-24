import { Router } from "express";
import { registerBill, getBills, getLastBillNo, getSingleBill, billPayment, updateBill, billPosting } from "../controllers/bill.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();


//secure routes
router.route("/add-bill").post(verifyJWT, registerBill)
router.route("/get-bills").get(verifyJWT, getBills)
router.route("/get-lastBillNo").get(verifyJWT, getLastBillNo)
router.route("/update-bill").patch(verifyJWT, updateBill)
router.route("/bill-posting").patch(verifyJWT, billPosting)

router.route("/get-single-bill/:billNo").get(verifyJWT, getSingleBill)
router.route("/bill-payment").post(verifyJWT, billPayment)
// router.route("/update-category").patch(verifyJWT, updateCategory)

// router.route("/add-type").post(verifyJWT, registerType)
// router.route("/get-types").get(verifyJWT, getTypes)
// router.route("/update-type").patch(verifyJWT, updateType)





export  { router as billRoutes};