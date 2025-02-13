import { Property } from "../entities/property";

export interface PropertyRepository {
  findPropertyById(id: number): Promise<Property | null>;
  save(property: Property): Promise<void>;
}
