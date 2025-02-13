import { Property } from "../domain/entities/property";
import { PropertyRepository } from "../domain/repositories/propery_repository";

export class PropertyService {
  private readonly propertyRepository: PropertyRepository

  constructor(
    propertyRepository: PropertyRepository
  ) {
    this.propertyRepository = propertyRepository
  }

  findPropertyById(id: number): Promise<Property | null> {
    return this.propertyRepository.findPropertyById(id)
  }
} 
