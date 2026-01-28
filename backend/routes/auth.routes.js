import express from "express"
import { login, logout, Register } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", Register)
router.post("/login", login)
router.post("/logout", logout)


//Router to get currently logged-in user
router.get("/me", protectRoute, (req, res)=>{
    res.status(200).json({ success: true, user: req.user});
})



export default router