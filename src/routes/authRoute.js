import express from "express"
import { signIn, signUp,signOut,refreshAccessToken } from "../controllers/authController.js"

const router = express.Router()

router.post("/signup",signUp)

router.post("/signin",signIn)

router.post("/signout",signOut)

router.post("/refresh",refreshAccessToken)
export default router