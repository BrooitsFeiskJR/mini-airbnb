import { UserService } from "../services/user_service"
import { FakeUserRepository } from "../../infrastructure/repositories/fake_user_repository"
import { User } from "../../domain/entities/user";

describe("User Service", () => {
  let userService: UserService;
  let fakeUserRepository: FakeUserRepository;

  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    userService = new UserService(fakeUserRepository);
  })
  it("should return null when an invalid id passed", async () => {
    const user = await userService.findUserById("999");
    expect(user).toBeNull();
  });

  it("should return an user when an valid id passed", async () => {
    const user = await userService.findUserById("1");
    expect(user).not.toBeNull();
    expect(user?.getId()).toBe("1")
    expect(user?.getName()).toBe("John Doe")
  });

  it("create a new user in repository and search", async () => {
    const newUser = new User("3", "Test User");
    await fakeUserRepository.save(newUser);

    const user = await fakeUserRepository.findUserById("3")
    expect(user).not.toBeNull();
    expect(user?.getId()).toBe("3");
    expect(user?.getName()).toBe("Test User");
  });
});


