import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser, changeCurrentPassword, getCurrentUser, registerBusiness, registerRole, getRoles } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

//secure routes
router.route("/logout").post(logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post( changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/register-business").post(verifyJWT, upload.single("businessLogo"), registerBusiness)
router.route("/register-role").post(verifyJWT, registerRole)
router.route("/get-roles").get(verifyJWT, getRoles)





export  { router as userRoutes};