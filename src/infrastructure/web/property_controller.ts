import { Request, Response } from "express";
import { PropertyService } from "../../application/services/property_service";
import { CreatePropertyDTO } from "../../application/dtos/create_property_dto";

export class PropertyController {
  private propertyService: PropertyService;
  constructor(service: PropertyService) {
    this.propertyService = service;
  }
  async createProperty(req: Request, res: Response): Promise<Response> {
    try {
      if (req.body.name == "") {
        return res.status(400).json({ message: "The property name is required." })
      }

      if (req.body.maxGuests <=0 ) {
        return res.status(400).json({message: "The maximum capacity must be greater than zero."})
      }
      
      if (req.body.basePricePerNight <= 0) {
        return res.status(400).json({message: "Base price per night is required."})
      }

      const dto: CreatePropertyDTO = {
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        maxGuests: req.body.maxGuests,
        basePricePerNight: req.body.basePricePerNight,
        type: req.body.type,
      }

      const  property = await this.propertyService.createProperty(dto);
      return res.status(201).json({
        message: "Property created successfully",
        property: {
          id: property.getId,
          name: property.getName,
          max_guests: property.getMaxGuests
        }
      })
    } catch (error: any) {
      return res.status(400).json({ message: error.message || "An unexpected error occurred" })
    }
  };
}
