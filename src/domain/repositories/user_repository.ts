import { User } from "../entities/user";

export interface UserRepository {
  findUserById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
