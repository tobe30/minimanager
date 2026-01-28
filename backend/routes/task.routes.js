import express from "express"
import { createTask, deleteTask, getTask, updateTask } from "../controller/task.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";


const router = express.Router()

router.post("/add-task", protectRoute, createTask)
router.patch("/:taskId", protectRoute, updateTask); 
router.get("/", protectRoute, getTask); 
router.delete("/:taskId", protectRoute, deleteTask);

export default router;