import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";

export class PropertyMapper {
  static toDomain(entity: PropertyEntity): Property {
    return new Property(
      entity.id,
      entity.name,
      entity.description,
      entity.maxGuests,
      Number(entity.basePricePerNight),
      "House"
    );
  }

  static toPersistence(entity: Property): PropertyEntity {
    const propertyEntity = new PropertyEntity()
    propertyEntity.id = entity.getId;
    propertyEntity.name = entity.getName;
    propertyEntity.description = entity.getDescription;
    propertyEntity.basePricePerNight = entity.getBasePricePerNight;
    propertyEntity.maxGuests = entity.getMaxGuests;
    return propertyEntity;
  }
}
