import { PropertyService } from "../application/property_service"
import { Property } from "../domain/entities/property";
import { FakePropertyRepository } from "../infrastructure/repositories/fake_property_repository"

describe("Property Service", () => {
  let propertyService: PropertyService;
  let fakePropertyRepository: FakePropertyRepository

  beforeEach(() => {
    fakePropertyRepository = new FakePropertyRepository()
    propertyService = new PropertyService(fakePropertyRepository)
  })

  it("should return null when an invalid id passed", async () => {
    const property = await propertyService.findPropertyById(999);
    expect(property).toBeNull();
  });

  it("should return an user when an valid id passed", async () => {
    const property = await propertyService.findPropertyById(1);
    expect(property).not.toBeNull();
    expect(property?.getId).toBe(1)
    expect(property?.getName).toBe("Property 1")
  });

  it("create a new property in repository and search", async () => {
    const newProperty = new Property(3, "Property 3", "Description 3", 5, 4000, "house");
    await fakePropertyRepository.save(newProperty);

    const property = await fakePropertyRepository.findPropertyById(3)
    expect(property).not.toBeNull();
    expect(property?.getId).toBe(3);
    expect(property?.getName).toBe("Property 3");
  });
});
