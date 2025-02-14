import { CreateBookingDTO } from "../dtos/create_booking_dto"
import { Booking } from "../../domain/entities/booking";
import { BookingRepository } from "../../domain/repositories/booking_repository"
import { BookingService } from "../services/booking_service"
import { FakeBookingRepository } from "../../infrastructure/repositories/fake_booking_repository"
import { PropertyService } from "./property_service"
import { UserService } from "./user_service"
import { DateRange } from "../../domain/value_objects/date_range";

jest.mock("./user_service")
jest.mock("./property_service")

describe("Booking Service", () => {
  let fakeBookingRepository: BookingRepository;
  let bookingService: BookingService;
  let mockPropertyService: jest.Mocked<PropertyService>;
  let mockUserService: jest.Mocked<UserService>;
  let mockDateRange: jest.Mocked<DateRange>;

  beforeEach(() => {
    const mockPropertyRepository = {} as any;
    const mockUserRepository = {} as any;
    const mockStartDate = {} as any;
    const mockEndDate = {} as any;

    mockPropertyService = new PropertyService(mockPropertyRepository) as jest.Mocked<PropertyService>;
    mockUserService = new UserService(mockUserRepository) as jest.Mocked<UserService>;
    mockDateRange = new DateRange(mockStartDate, mockEndDate) as jest.Mocked<DateRange>;

    fakeBookingRepository = new FakeBookingRepository();
    bookingService = new BookingService(
      fakeBookingRepository,
      mockPropertyService,
      mockUserService,
      mockDateRange
    );

  })

  it("should create a booking with successfully usign fake repository", async () => {
    const mockProperty = {
      getId: jest.fn().mockReturnValue(1),
      isAvailable: jest.fn().mockReturnValue(true),
      validateGuestCount: jest.fn(),
      calculateTotalPrice: jest.fn().mockReturnValue(500),
      addBooking: jest.fn(),
    } as any;

    const mockUser = {
      getId: jest.fn().mockReturnValue("1"),
    } as any;

    const mockDateRange = {
      validateDateRange: jest.fn(),
      getStartDate: jest.fn().mockReturnValue(new Date("2024-12-20")),
      getEndDate: jest.fn().mockReturnValue(new Date("2024-12-25")),
      getTotalNights: jest.fn().mockReturnValue(5),
      overLaps: jest.fn().mockReturnValue(false)
    }

    const bookingDTO: CreateBookingDTO = {
      propertyId: 1,
      guestId: "1",
      startDate: new Date("2024-12-20"),
      endDate: new Date("2024-12-25"),
      guestCount: 2,
    };

    mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
    mockUserService.findUserById.mockResolvedValue(mockUser);
    mockDateRange.getStartDate.mockResolvedValue(mockDateRange);
    mockDateRange.getEndDate.mockResolvedValue(mockDateRange);

    const result: Booking = await bookingService.createBooking(bookingDTO);

    expect(result).toBeInstanceOf(Booking)
    expect(result.getStatus).toBe("CONFIRMED")
    expect(result.getTotalPrice).toBe(500)

    const savedBooking = await fakeBookingRepository.findById(result.getId);
    expect(savedBooking).not.toBeNull();
    expect(savedBooking?.getId).toBe(result.getId);
  });
});
