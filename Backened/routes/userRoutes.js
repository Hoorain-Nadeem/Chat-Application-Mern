import express from "express"
import {register, login, logout, checkAuth}  from "../controller/userController.js"


import profileMiddleware from '../middleware/authMiddleware.js'
import { upload } from'../controller/userController.js'
let userRouter = express.Router()

userRouter.post("/register",upload.single("photo"),register)
userRouter.post("/login",login)
userRouter.post("/logout",logout)
userRouter.get("/check",profileMiddleware,checkAuth)
export default userRouter;