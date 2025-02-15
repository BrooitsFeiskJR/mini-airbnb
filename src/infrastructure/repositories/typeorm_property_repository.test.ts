import { DataSource, Repository } from "typeorm";
import { UserEntity } from "../persistence/entities/user_entity";
import { Property } from "../../domain/entities/property"
import { PropertyEntity } from "../persistence/entities/property_entity"
import { TypeORMPropertyRepository } from "./typeorm_property_repository";


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
        entities: [UserEntity, PropertyEntity],
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
});
