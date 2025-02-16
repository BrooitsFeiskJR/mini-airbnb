import { DataSource, Repository } from "typeorm";
import { User } from "../../domain/entities/user";
import { UserEntity } from "../persistence/entities/user_entity";
import { TypeORMUserRepository } from "./typeorm_user_repository"
describe("TypeORM User Repository", () => {
  let dataSource: DataSource;
  let userRepository: TypeORMUserRepository;
  let repository: Repository<UserEntity>;

  beforeAll(async () => {
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
    repository = dataSource.getRepository(UserEntity);
    userRepository = new TypeORMUserRepository(repository);
  })

  afterAll(async () => {
    await dataSource.destroy();
  });

  it("should save an user with user", async () => {
    const user = new User("1", "John Doe");
    await userRepository.save(user);

    const savedUser = await repository.findOne({ where: { id: "1" } });

    expect(savedUser).not.toBeNull();
    expect(savedUser?.id).toBe("1");
    expect(savedUser?.name).toBe("John Doe");
  })

  it("should return an user when a valid id is passed", async () => {
    const user = new User("1", "John Doe");
    await userRepository.save(user);

    const savedUser = await userRepository.findUserById("1");
    expect(savedUser).not.toBeNull();
    expect(savedUser?.getId()).toBe("1");
    expect(savedUser?.getName()).toBe("John Doe");
  })

  it("should return null when try search an invalid user", async () => {
    const user = await userRepository.findUserById("222");
    expect(user).toBeNull();
  })
});
