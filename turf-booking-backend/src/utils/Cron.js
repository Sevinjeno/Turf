import cron from "node-cron";
import { addNewDaySlots, cleanupOldSlots } from "../services/timeSlotService.js";

// Run every night at 12:01 AM
cron.schedule("1 0 * * *", async () => {
    console.log("⏳ Running daily slot update...");
    await addNewDaySlots();
    await cleanupOldSlots();
    console.log("✅ Daily slot update completed.");
});