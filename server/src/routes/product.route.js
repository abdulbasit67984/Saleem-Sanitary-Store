import { Router } from "express";
import { registerProduct, getProducts, updateProduct, 
    registerCategory, getCategories, updateCategory,
    registerType, getTypes, updateType
} from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();


//secure routes
router.route("/add-product").post(verifyJWT, registerProduct)
router.route("/get-products").get(verifyJWT, getProducts)
router.route("/update-product").patch(verifyJWT, updateProduct)

router.route("/add-category").post(verifyJWT, registerCategory)
router.route("/get-categories").get(verifyJWT, getCategories)
router.route("/update-category").patch(verifyJWT, updateCategory)

router.route("/add-type").post(verifyJWT, registerType)
router.route("/get-types").get(verifyJWT, getTypes)
router.route("/update-type").patch(verifyJWT, updateType)





export  { router as productRoutes};