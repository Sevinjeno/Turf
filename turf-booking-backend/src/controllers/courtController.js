import { getCourtsByTurfId } from "../services/courtsService.js";

export const getCourtsController = async (req, res) => {
  try {
    const { turf_id } = req.params; // /api/courts?turf_id=123
    if (!turf_id) {
      return res.status(400).json({ error: "turf_id is required" });
    }
    const courts = await getCourtsByTurfId(turf_id);
    res.json(courts);
  } catch (err) {
    console.error("Error fetching courts:", err);
    res.status(500).json({ error: "Server error" });
  }
};