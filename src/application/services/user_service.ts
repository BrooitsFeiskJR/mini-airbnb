import { User } from "../../domain/entities/user";
import { UserRepository } from "../../domain/repositories/user_repository";
import { CreateUserDTO } from "../dtos/create_user_dto";

export class UserService {
  private readonly userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findUserById(id);
  }

  async createUser(dto: CreateUserDTO): Promise<User> {
    const user = new User(
      dto.id,
      dto.name
    );
    await this.userRepository.save(user);
    return user;
  }
}

