import express from "express";
import { forgotPassword, getAllUsers, login, oauthLogin, signup } from "../Controllers/userController.js";
import { authenticateToken } from "../Utils/Utils.js";

const router = express.Router()

router.post("/authenticate/:id",authenticateToken ,(req, res) => {
})

router.get("/", getAllUsers)
router.post('/OAuth/:clientId',oauthLogin)
router.post('/signup', signup)
router.post('/login', login)
router.post('/forgotPassword', forgotPassword)

export default router