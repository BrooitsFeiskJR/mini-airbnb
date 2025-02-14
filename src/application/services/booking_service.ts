import { Booking } from "../../domain/entities/booking";
import { BookingRepository } from "../../domain/repositories/booking_repository";
import { DateRange } from "../../domain/value_objects/date_range";
import { CreateBookingDTO } from "../dtos/create_booking_dto";
import { PropertyService } from "./property_service";
import { UserService } from "./user_service";

export class BookingService {
  private readonly bookingRepository: BookingRepository;
  private readonly propertyService: PropertyService;
  private readonly userService: UserService;
  private readonly dateRange: DateRange;

  constructor(bookingRepository: BookingRepository, propertyService: PropertyService, userService: UserService, dateRange: DateRange) {
    this.bookingRepository = bookingRepository;
    this.propertyService = propertyService;
    this.userService = userService;
    this.dateRange = dateRange;
  }


  async createBooking(dto: CreateBookingDTO): Promise<Booking> {
    const property = await this.propertyService.findPropertyById(dto.propertyId);
    if (!property) {
      throw new Error("Property not found.");
    }
    const guest = await this.userService.findUserById(dto.guestId);
    if (!guest) {
      throw new Error("User not found.");
    }

    const booking = new Booking(
      1,
      property,
      guest,
      this.dateRange,
      dto.guestCount
    );

    await this.bookingRepository.save(booking);
    return booking;
  }
}
