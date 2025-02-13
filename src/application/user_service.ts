import { User } from "../domain/entities/user";
import { UserRepository } from "../domain/repositories/user_repository";

export class UserService {
  private readonly userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findUserById(id);
  }
}

