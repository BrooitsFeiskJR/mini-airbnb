import { DateRange } from "../value_objects/date_range";
import { Booking } from "./booking";

export class Property {
  private readonly id: number;
  private readonly name: string;
  private readonly description: string;
  private readonly maxGuests: number;
  private readonly basePricePerNight: number;
  private readonly type: string;
  private readonly bookings: Booking[] = [];

  constructor(id: number, name: string, description: string, maxGuests: number, basePricePerNight: number, type: string) {
    this.validateFields(name, maxGuests);
    this.id = id;
    this.name = name;
    this.description = description;
    this.maxGuests = maxGuests;
    this.basePricePerNight = basePricePerNight;
    this.type = type;
  }

  private validateFields(name: string, maxGuests: number): void {
    if (maxGuests <= 0) {
      throw new Error("Max guests must be greater than 0");
    }
    if (name === "") {
      throw new Error("Property name cannot be empty");
    }
  }

  validateGuestCount(count: number): void {
    if (count > this.maxGuests) {
      throw new Error("Guest count exceeds max guest count");
    }
  }

  calculateTotalPrice(dateRange: DateRange): number {
    const totalNights = dateRange.getTotalNights();
    let totalPrice = totalNights * this.basePricePerNight;

    if (totalNights >= 7) {
      totalPrice *= 0.9;
    }

    return totalPrice;
  }

  isAvailable(dateRange: DateRange): boolean {
    return !this.bookings.some(
      (booking) =>
        booking.getStatus === "CONFIRMED" &&
        booking.getDateRange.overLaps(dateRange)
    );
  }

  addBooking(booking: Booking): void {
    this.bookings.push(booking);
  }

  get getBookings(): Booking[] {
    return [...this.bookings];
  }

  get getId(): number {
    return this.id;
  }

  get getName(): string {
    return this.name;
  }

  get getDescription(): string {
    return this.description;
  }

  get getMaxGuests(): number {
    return this.maxGuests;
  }

  get getBasePricePerNight(): number {
    return this.basePricePerNight;
  }

  get getType(): string {
    return this.type;
  }
}
