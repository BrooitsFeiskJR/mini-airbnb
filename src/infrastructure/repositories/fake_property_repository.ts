import { Property } from "../../domain/entities/property";
import { PropertyRepository } from "../../domain/repositories/propery_repository"

export class FakePropertyRepository implements PropertyRepository {
  properties: Property[] = [
    new Property(1, "Property 1", "description 1", 2, 200, "house"),
    new Property(1, "Property 2", "description 2", 2, 200, "house")
  ]

  async findPropertyById(id: number): Promise<Property | null> {
    return this.properties.find((property) => property.getId === id) || null
  }

  async save(property: Property): Promise<void> {
    this.properties.push(property);
  }
}
