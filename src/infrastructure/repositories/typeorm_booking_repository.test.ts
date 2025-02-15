import { DataSource } from "typeorm";
import { UserEntity } from "../persistence/entities/user_entity";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { User } from "../../domain/entities/user";
import { DateRange } from "../../domain/value_objects/date_range";
import { Property } from "../../domain/entities/property";
import { Booking } from "../../domain/entities/booking";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { TypeORMBookingRepository } from "./typeorm_booking_repository";

describe("TypeORM Booking Repository", () => {
  let dataSource: DataSource;
  let bookingRepository: TypeORMBookingRepository;

  beforeAll(async () => {
    dataSource = new DataSource(
      {
        type: "sqlite",
        database: ":memory",
        dropSchema: true,
        entities: [BookingEntity, PropertyEntity, UserEntity],
        synchronize: true,
        logging: false,

      }
    );
    await dataSource.initialize();
    bookingRepository = new TypeORMBookingRepository(
      dataSource.getRepository(BookingEntity)
    );
  });

  afterAll(async () => {
    await dataSource.destroy();
  })

  it("should save an reservation successfully", async () => {
    const propertyRepository = dataSource.getRepository(PropertyEntity);
    const userRepository = dataSource.getRepository(UserEntity);

    const propertyEntity = propertyRepository.create({
      id: 1,
      name: "House",
      description: "House description",
      maxGuests: 6,
      basePricePerNight: 200,
    });
    await propertyRepository.save(propertyEntity);

    const property = new Property(1, "House", "House description", 6, 200, "House")

    const userEntity = userRepository.create({
      id: "1",
      name: "John Doe"
    });
    await userRepository.save(userEntity);

    const user = new User("1", "John Doe");
    const dateRange = new DateRange(new Date("2024-12-20"), new Date("2024-12-25"))

    const booking = new Booking(1, property, user, dateRange, 4);

    await bookingRepository.save(booking);

    const savedBooking = await bookingRepository.findById(1);
    expect(savedBooking).not.toBeNull();
  });

  it("should return null when search a reservation with invalid id", async () => {
    const savedBooking = await bookingRepository.findById(3);
    expect(savedBooking).toBeNull();
  });

  it("should save an reservation successfully and cancel after", async () => {
    const propertyRepository = dataSource.getRepository(PropertyEntity);
    const userRepository = dataSource.getRepository(UserEntity);

    const propertyEntity = propertyRepository.create({
      id: 1,
      name: "House",
      description: "House description",
      maxGuests: 6,
      basePricePerNight: 200,
    });
    await propertyRepository.save(propertyEntity);

    const property = new Property(1, "House", "House description", 6, 200, "House")

    const userEntity = userRepository.create({
      id: "1",
      name: "John Doe"
    });
    await userRepository.save(userEntity);

    const user = new User("1", "John Doe");
    const dateRange = new DateRange(new Date("2024-12-20"), new Date("2024-12-25"))

    const booking = new Booking(1, property, user, dateRange, 4);

    await bookingRepository.save(booking);
    booking.cancel(new Date("2024-12-15"));
    await bookingRepository.save(booking);

    const updateBooking = await bookingRepository.findById(1);
    expect(updateBooking).not.toBeNull();
    expect(updateBooking?.getStatus).toBe("CANCELLED");
  });
});
