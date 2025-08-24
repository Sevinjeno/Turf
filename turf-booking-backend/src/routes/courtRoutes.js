// routes/courtRoutes.js
import express from "express";
import { getCourtsController } from "../controllers/courtController.js";

const router = express.Router();

// GET /api/courts?turf_id=123
router.get("/:turf_id", getCourtsController);

export default router;