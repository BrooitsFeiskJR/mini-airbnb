import { DataSource, Repository } from "typeorm";
import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";
import { PropertyMapper } from "./property_mapper";
import { TypeORMPropertyRepository } from "../../repositories/typeorm_property_repository";
import { BookingEntity } from "../entities/booking_entity";
import { UserEntity } from "../entities/user_entity";

describe("Property Mapper", () => {
  let dataSource: DataSource;
  let propertyRepository: TypeORMPropertyRepository;
  let repository: Repository<PropertyEntity>;

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
    repository = dataSource.getRepository(PropertyEntity);
    propertyRepository = new TypeORMPropertyRepository(repository);
  })

  afterAll(async () => {
    await dataSource.destroy();
  })

  it("deve converter PropertyEntity em Property corretamente", async () => {
    const entity = new Property(
      1,
      "House",
      "Description",
      6,
      200,
      "House"
    )
    await propertyRepository.save(entity);
    const entitySaved = await repository.findOne({ where: { id: 1 } });

    const property = PropertyMapper.toDomain(entitySaved!);
    expect(property).toBeInstanceOf(Property);
    expect(property).not.toBeNull();
    expect(property.getId).toBe(1);
  });
  it("deve converter Property para PropertyEntity corretamente", async () => {
    const property = new Property(
      1,
      "House",
      "Description",
      6,
      200,
      "House"
    )
    const propertyPersistence = PropertyMapper.toPersistence(property)
    const propertySaved = await repository.save(propertyPersistence)

    expect(propertySaved).toBeInstanceOf(PropertyEntity)
    expect(propertySaved).not.toBeNull();
    expect(propertySaved.id).toBe(1);
  })
  it("deve lançar erro de validação ao faltar o campo name obrigatório", () => {
    expect(() => {
      new Property(
        1,
        "", 
        "Descrição válida",
        6,
        200,
        "House"
      );
    }).toThrow("Property name cannot be empty");
  });
});
