import { Property } from "../../domain/entities/property";
import { PropertyRepository } from "../../domain/repositories/propery_repository";
import { CreatePropertyDTO } from "../dtos/create_property_dto";

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
  async createProperty(dto: CreatePropertyDTO): Promise<Property> {
    const property = new Property(dto.id, dto.name, dto.description, dto.maxGuests, dto.basePricePerNight, dto.type);
    await this.propertyRepository.save(property);
    return property;
  }
} 
