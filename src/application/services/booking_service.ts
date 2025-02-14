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

  constructor(bookingRepository: BookingRepository, propertyService: PropertyService, userService: UserService) {
    this.bookingRepository = bookingRepository;
    this.propertyService = propertyService;
    this.userService = userService;
  }


  async createBooking(dto: CreateBookingDTO): Promise<Booking> {
    const property = await this.propertyService.findPropertyById(dto.propertyId);
    if (!property) {
      throw new Error("Property not found.");
    }
    const guest = await this.userService.findUserById(dto.guestId);
    if (!guest) {
      throw new Error("User not found");
    }
    // TODO: Refactoring to mock the date range.
    const dateRange = new DateRange(dto.startDate, dto.endDate);

    const booking = new Booking(
      1,
      property,
      guest,
      dateRange,
      dto.guestCount
    );

    await this.bookingRepository.save(booking);
    return booking;
  }
}
