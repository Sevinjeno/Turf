import express from "express";
import {
  createTurfController,
  getAvailableSlots,
  getNearbyTurfs,
  getTurfByIdController,
  getTurfsByAdminIdController,
  getTurfsByLocationController,
  updateTurfController,
} from "../controllers/turfController.js";
import { upload } from "../utils/Multer.js";

const router = express.Router();

// Route for creating a turf
router.post("/", upload.single("image"), createTurfController);

router.get("/nearby", getNearbyTurfs);

// Route for fetching turfs by location
router.get("/location", getTurfsByLocationController);

router.get("/api/turfs/:id/slots", getAvailableSlots);

router.get("/admin/:id", getTurfsByAdminIdController);

router.get("/:id", getTurfByIdController);

router.put("/update/:id", updateTurfController);

export default router;
