export interface BookingPreviewRequest {
  turf_id: string | number;
  start_time: string;
  end_time: string;
  court_id: string | number | null;
}

export interface BookingPreviewResponse {
  basePrice: number;
  platformFee: number;
  totalAmount: number;
}

export interface CreateBookingRequest {
  turf_id: string | number;
  start_time: string;
  end_time: string;
  court_id: string | number;
}