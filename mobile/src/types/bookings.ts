export type SlotStatus = "available" | "booked";

export type Slot = {
  time: string; // "HH:mm"
  status: SlotStatus;
};

export type SelectedSlot = {
  start: Slot | null;
  end: Slot | null;
};

export type Court = {
  id: string;
  name: string;
};

export type PricePreview = {
  total: number;
  turfAmount?: number;
  platformFee?: number;
};

export type UseSlotsResponse = {
  slots: Slot[];
  minDuration: number;
};

export type BookingPayload = {
  turfId: string;
  courtId: string;
  date: string;
  startTime: string;
  endTime: string;
};