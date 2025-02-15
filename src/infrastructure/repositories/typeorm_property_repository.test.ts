import { DataSource, Repository } from "typeorm";
import { UserEntity } from "../persistence/entities/user_entity";
import { Property } from "../../domain/entities/property"
import { PropertyEntity } from "../persistence/entities/property_entity"
import { TypeORMPropertyRepository } from "./typeorm_property_repository";
import { BookingEntity } from "../persistence/entities/booking_entity";


describe("TypeORM Property Repository", () => {
  let dataSource: DataSource;
  let propertyRepository: TypeORMPropertyRepository;
  let repository: Repository<PropertyEntity>;

  beforeAll(async () => {
    dataSource = new DataSource(
      {
        type: "sqlite",
        database: ":memory",
        dropSchema: true,
        entities: [UserEntity, PropertyEntity, BookingEntity],
        synchronize: true,
        logging: false,
      }
    );
    await dataSource.initialize();
    repository = dataSource.getRepository(PropertyEntity);
    propertyRepository = new TypeORMPropertyRepository(repository);
  })

  afterAll(async () => {
    await dataSource.destroy();
  })

  it("should create an property entity", async () => {
    const property = new Property(
      1,
      "House",
      "Description",
      6,
      200,
      "House"
    );

    await propertyRepository.save(property);
    const savedProperty = repository.findOne({ where: { id: 1 } });
    expect(savedProperty).not.toBeNull();
  });

  it("should return a property entity with valid id", async () => {
    const property = new Property(
      1,
      "House",
      "Description",
      6,
      200,
      "House"
    );

    await propertyRepository.save(property);
    const savedProperty = await propertyRepository.findPropertyById(1);
    expect(savedProperty).not.toBeNull();
    expect(savedProperty?.getId).toBe(1);
    expect(savedProperty?.getName).toBe("House");
  });

  it("should return a property entity with invalid id", async () => {
    const property = await propertyRepository.findPropertyById(222);
    expect(property).toBeNull();
  });
});
