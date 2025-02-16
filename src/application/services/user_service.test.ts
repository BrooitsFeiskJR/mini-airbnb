import { UserService } from "../services/user_service"
import { FakeUserRepository } from "../../infrastructure/repositories/fake_user_repository"
import { User } from "../../domain/entities/user";
import { Repository, DataSource } from "typeorm";
import { UserEntity } from "../../infrastructure/persistence/entities/user_entity";
import { TypeORMUserRepository } from "../../infrastructure/repositories/typeorm_user_repository";
import { CreateUserDTO } from "../dtos/create_user_dto";

describe("User Service", () => {
  let dataSource: DataSource;
  let userServiceFake: UserService;
  let userServiceTypORM: UserService;
  let fakeUserRepository: FakeUserRepository;
  let userReposiotry: Repository<UserEntity>;
  let typeORMUserRepository: TypeORMUserRepository

  beforeEach(async () => {
    dataSource = new DataSource(
          {
            type: "sqlite",
            database: ":memory",
            dropSchema: true,
            entities: [UserEntity],
            synchronize: true,
            logging: false,
          }
    );
    await dataSource.initialize();
    userReposiotry = dataSource.getRepository(UserEntity);
    typeORMUserRepository = new TypeORMUserRepository(userReposiotry);
    fakeUserRepository = new FakeUserRepository();
    userServiceFake = new UserService(fakeUserRepository);
    userServiceTypORM = new UserService(typeORMUserRepository);
  })
  it("should return null when an invalid id passed", async () => {
    const user = await userServiceFake.findUserById("999");
    expect(user).toBeNull();
  });

  it("should return an user when an valid id passed", async () => {
    const user = await userServiceFake.findUserById("1");
    expect(user).not.toBeNull();
    expect(user?.getId()).toBe("1")
    expect(user?.getName()).toBe("John Doe")
  });

  it("create a new user in fake repository and search", async () => {
    const newUser = new User("3", "Test User");
    await fakeUserRepository.save(newUser);

    const user = await fakeUserRepository.findUserById("3")
    expect(user).not.toBeNull();
    expect(user?.getId()).toBe("3");
    expect(user?.getName()).toBe("Test User");
  });

  it("create a new user in typerom repository and search", async () => {
    const newUser = new User("3", "Test User");
    await typeORMUserRepository.save(newUser);

    const user = await typeORMUserRepository.findUserById("3")
    expect(user).not.toBeNull();
    expect(user?.getId()).toBe("3");
    expect(user?.getName()).toBe("Test User");
  });

  it("should return an user when an valid id passed", async () => {
    const newUser = new User("1", "Test User");
    await typeORMUserRepository.save(newUser);
    const user = await userServiceTypORM.findUserById("1");
    expect(user).not.toBeNull();
    expect(user?.getId()).toBe("1")
    expect(user?.getName()).toBe("Test User")
  });
  it("create a new user usign user service with userdto", async () => {
    const dto: CreateUserDTO = {id: "1", name: "Test User"};
    const user = await userServiceTypORM.createUser(dto);
    expect(user).not.toBeNull();
    expect(user?.getId()).toBe("1")
    expect(user?.getName()).toBe("Test User")
  });
});


