import { generateInitialSlots } from "../services/timeSlotService.js";

(async () => {
    console.log("🚀 Generating initial 90 days of slots...");
    await generateInitialSlots();
    console.log("✅ Initial slot generation completed.");
    process.exit();
})();