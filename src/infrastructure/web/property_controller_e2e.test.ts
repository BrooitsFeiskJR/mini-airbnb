import express from "express";
import request from "supertest";
import { DataSource, Repository } from "typeorm";
import { TypeORMPropertyRepository } from "../repositories/typeorm_property_repository";
import { UserEntity } from "../persistence/entities/user_entity";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { BookingEntity } from "../persistence/entities/booking_entity";
import {PropertyController} from "./property_controller";
import { PropertyService } from "../../application/services/property_service";

const app = express();
app.use(express.json());

let dataSource: DataSource;
let repository: Repository<PropertyEntity>;
let userRepository: TypeORMPropertyRepository;
let propertyService: PropertyService;
let propertyController: PropertyController

beforeAll(async () => {
  dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [UserEntity, BookingEntity, PropertyEntity],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();
  repository = dataSource.getRepository(PropertyEntity);

  userRepository = new TypeORMPropertyRepository(repository);

  propertyService = new PropertyService(userRepository);

  propertyController = new PropertyController(propertyService);

  app.post("/properties", (req, res, next) => {
    propertyController.createProperty(req, res).catch((err) => next(err));
  });
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("Property Controller", () => {
  beforeAll(async () => {
    const userRepo = dataSource.getRepository(UserEntity);
    await userRepo.clear();
  });

  it("should create a property successfully", async () => {
    const response = await request(app).post("/properties").send({
      id: 1,
      name: "Property Name",
      description: "Property Description",
      maxGuests: 4,
      basePricePerNight: 100,
      type: "House",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Property created successfully");
    expect(response.body.property).toHaveProperty("id");
    expect(response.body.property).toHaveProperty("name");
    expect(response.body.property).toHaveProperty("max_guests");
  });
  it("should return error with code 400 and message 'The property name is required.' when sending an empty name", async () => {
    const response = await request(app).post("/properties").send({
      id: 1,
      name: "",
      description: "Property Description",
      maxGuests: 4,
      basePricePerNight: 100,
      type: "House",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("The property name is required.");
  });

  it("should return error with code 400 and message 'The maximum capacity must be greater than zero.' when sending an empty max guests", async () => {
    const response = await request(app).post("/properties").send({
      id: 1,
      name: "Property",
      description: "Property Description",
      maxGuests: 0,
      basePricePerNight: 100,
      type: "House",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("The maximum capacity must be greater than zero.");
  });

  it("should return error with code 400 and message 'Base price per night is required.' when sending missing basePricePerNight", async () => {
    const response = await request(app).post("/properties").send({
      id: 1,
      name: "Property",
      description: "Property Description",
      maxGuests: 4,
      basePricePerNight: 0,
      type: "House",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Base price per night is required.");
  });
});
