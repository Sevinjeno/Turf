export type SlotStatus = "available" | "booked";

export interface Slot {
  time: string; 
  status: SlotStatus;
  courtId?: number;
}

export interface SelectedSlot {
  start: Slot | null;
  end: Slot | null;
  status?: SlotStatus;
  courtId?: number;
}