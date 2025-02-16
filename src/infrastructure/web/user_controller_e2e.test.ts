import express from "express";
import request from "supertest";
import { DataSource, Repository } from "typeorm";
import { TypeORMUserRepository } from "../repositories/typeorm_user_repository";
import { UserService } from "../../application/services/user_service";
import { UserEntity } from "../persistence/entities/user_entity";
import {UserController} from "./user_controller";

const app = express();
app.use(express.json());

let dataSource: DataSource;
let repository: Repository<UserEntity>;
let userRepository: TypeORMUserRepository;
let userService: UserService;
let userController: UserController

beforeAll(async () => {
  dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [UserEntity],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();
  repository = dataSource.getRepository(UserEntity);

  userRepository = new TypeORMUserRepository(repository);

  userService = new UserService(userRepository);

  userController = new UserController(userService);

  app.post("/users", (req, res, next) => {
    userController.createUser(req, res).catch((err) => next(err));
  });
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("UserController", () => {
  beforeAll(async () => {
    const userRepo = dataSource.getRepository(UserEntity);
    await userRepo.clear();
  });

  it("should create a user successfully", async () => {
    const response = await request(app).post("/users").send({
      id: "1",
      name: "Test user",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User created successfully");
    expect(response.body.user).toHaveProperty("id");
  });
  it("should return error with code 400 and message 'The name field is mandatory.' when sending an empty name", async () => {
    const response = await request(app).post("/users").send({
      id: "1",
      name: "",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Name can not be empty");
  });
});
