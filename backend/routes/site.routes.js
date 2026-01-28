import express from "express";
import { createSite, deleteSite, getSites } from "../controller/site.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", protectRoute, createSite);
router.delete("/:siteId", protectRoute, deleteSite);
router.get("/", protectRoute, getSites);



export default router;
