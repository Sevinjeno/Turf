import { generateInitialSlots } from "../services/timeSlotService.js";

(async () => {
    await generateInitialSlots();
    process.exit();
})();