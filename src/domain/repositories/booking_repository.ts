import { Booking } from "../entities/booking"

export interface BookingRepository {
  save(booking: Booking): Promise<void>
  findById(id: number): Promise<Booking | null>
}
