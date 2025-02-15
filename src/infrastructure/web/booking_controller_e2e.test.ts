import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { TypeORMBookingRepository } from "../repositories/typeorm_booking_repository";
import { TypeORMPropertyRepository } from "../repositories/typeorm_property_repository";
import { TypeORMUserRepository } from "../repositories/typeorm_user_repository";
import { BookingService } from "../../application/services/booking_service";
import { PropertyService } from "../../application/services/property_service";
import { UserService } from "../../application/services/user_service";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { UserEntity } from "../persistence/entities/user_entity";
import { BookingController } from "../web/booking_controller";

const app = express();
app.use(express.json());

let dataSource: DataSource;
let bookingRepository: TypeORMBookingRepository;
let propertyRepository: TypeORMPropertyRepository;
let userRepository: TypeORMUserRepository;
let bookingService: BookingService;
let propertyService: PropertyService;
let userService: UserService;
let bookingController: BookingController;

beforeAll(async () => {
  dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [BookingEntity, PropertyEntity, UserEntity],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();

  bookingRepository = new TypeORMBookingRepository(
    dataSource.getRepository(BookingEntity)
  );
  propertyRepository = new TypeORMPropertyRepository(
    dataSource.getRepository(PropertyEntity)
  );
  userRepository = new TypeORMUserRepository(
    dataSource.getRepository(UserEntity)
  );

  propertyService = new PropertyService(propertyRepository);
  userService = new UserService(userRepository);
  bookingService = new BookingService(
    bookingRepository,
    propertyService,
    userService
  );

  bookingController = new BookingController(bookingService);

  app.post("/bookings", (req, res, next) => {
    bookingController.createBooking(req, res).catch((err) => next(err));
  });

  app.post("/bookings/:id/cancel", (req, res, next) => {
    bookingController.cancelBooking(req, res).catch((err) => next(err));
  });
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("BookingController", () => {
  beforeAll(async () => {
    const propertyRepo = dataSource.getRepository(PropertyEntity);
    const userRepo = dataSource.getRepository(UserEntity);
    const bookingRepo = dataSource.getRepository(BookingEntity);

    await bookingRepo.clear();
    await propertyRepo.clear();
    await userRepo.clear();

    await propertyRepo.save({
      id: 1,
      name: "Property",
      description: "Property Description",
      maxGuests: 5,
      basePricePerNight: 100,
    });

    await userRepo.save({
      id: "1",
      name: "Test user",
    });
  });

  it("should create a reservation successfully", async () => {
    const response = await request(app).post("/bookings").send({
      propertyId: "1",
      guestId: "1",
      startDate: "2024-12-20",
      endDate: "2024-12-25",
      guestCount: 2,
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Booking created successfully");
    expect(response.body.booking).toHaveProperty("id");
    expect(response.body.booking).toHaveProperty("totalPrice");
  });

  it("should return 400 with invalid start date", async () => {
    const response = await request(app).post("/bookings").send({
      propertyId: "1",
      guestId: "1",
      startDate: "invalid-date",
      endDate: "2024-12-25",
      guestCount: 2,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("StartDate or EndDate invalid");
  });
  it("should return 400 with invalid end date", async () => {
    const response = await request(app).post("/bookings").send({
      propertyId: "1",
      guestId: "1",
      startDate: "2024-12-20",
      endDate: "invalid-date",
      guestCount: 2,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("StartDate or EndDate invalid");
  });

  it("should return 400 when invalid number of guest is passed.", async () => {
    const response = await request(app).post("/bookings").send({
      propertyId: "1",
      guestId: "1",
      startDate: "2024-12-20",
      endDate: "2024-12-25",
      guestCount: 0,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "The number of guest must be greater than zero"
    );
  });

  it("should return 400 when invalid propertyID is passed.", async () => {
    const response = await request(app).post("/bookings").send({
      propertyId: "invalid-id",
      guestId: "1",
      startDate: "2024-12-20",
      endDate: "2024-12-25",
      guestCount: 2,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Property not found.");
  });

  it("should create a reservation successfully and after cancel this reservation", async () => {
    const response = await request(app).post("/bookings").send({
      propertyId: "1",
      guestId: "1",
      startDate: "2024-12-20",
      endDate: "2024-12-25",
      guestCount: 2,
    });

    const bookingId = response.body.booking.id;

    const cancelResponse = await request(app).post(
      `/bookings/${bookingId}/cancel`
    )
    expect(cancelResponse.status).toBe(200);
    expect(cancelResponse.body.message).toBe("Booking canceled successfully");
  });

  it("should return an error when an invalid reservation is passed", async () => {
    const cancelResponse = await request(app).post(`/bookings/999/cancel`);

    expect(cancelResponse.status).toBe(400);
    expect(cancelResponse.body.message).toBe("Reservation not found.");
  });
});
