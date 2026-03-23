export type SlotStatus = "available" | "booked";

export interface SelectedSlot {
    start : Slot | null ;
    status:SlotStatus;
    courtId?:number;
}

export interface Slot{
    start:string;
    status:SlotStatus;
    courtId?:number;
}