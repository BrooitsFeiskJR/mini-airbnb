import { DataSource, Repository } from "typeorm";
import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";
import { PropertyMapper } from "./property_mapper";
import { BookingEntity } from "../entities/booking_entity";
import { UserEntity } from "../entities/user_entity";
import { TypeORMBookingRepository } from "../../repositories/typeorm_booking_repository";
import { User } from "../../../domain/entities/user";
import { DateRange } from "../../../domain/value_objects/date_range";
import { Booking } from "../../../domain/entities/booking";
import { BookingMapper } from "./booking_mapper";

describe("Booking Mapper", () => {
  let dataSource: DataSource;
  let bookingRepository: TypeORMBookingRepository;
  let repository: Repository<BookingEntity>;

  beforeAll(async () => {
    dataSource = new DataSource(
      {
        type: "sqlite",
        database: ":memory",
        dropSchema: true,
        entities: [PropertyEntity, BookingEntity, UserEntity],
        synchronize: true,
        logging: false,
      }
    );
    await dataSource.initialize();
    repository = dataSource.getRepository(BookingEntity);
    bookingRepository = new TypeORMBookingRepository(repository);
  })

  afterAll(async () => {
    await dataSource.destroy();
  })

  it("deve converter BookingEntity em Booking corretamente", async () => {
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
    const id = booking.getId
    
    await bookingRepository.save(booking);

    const savedBooking = await repository.findOne({
      where: { id },
      relations: ["property", "guest"],
    });

    const mapperEntity = BookingMapper.toDomain(savedBooking!)
    expect(mapperEntity).toBeInstanceOf(Booking)
    expect(mapperEntity.getId).toBe(1)
  });
  it("deve converter Booking para BookingEntity corretamente", async () => {
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
    const bookingPersistence = BookingMapper.toPersistence(booking);
    const bookingSaved = await repository.save(bookingPersistence);

    expect(bookingSaved).toBeInstanceOf(BookingEntity)
    expect(bookingSaved).not.toBeNull();
    expect(bookingSaved.id).toBe(1);
  });

  it("deve lançar erro de validação ao faltar campos obrigatórios no BookingEntity", async () => {
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

    expect(() => {
      new Booking(1, property, user, dateRange, 0)
    }).toThrow("The number of guest must be greater than zero");
  });
});
