import { Property } from './property';
import { DateRange } from '../value_objects/date_range';

describe('Property Entity', () => {
    it("should create a property", () => {
        const property = new Property(1, "Property 1", "Description of property 1", 2, 1000, "house");

        expect(property.getId).toBe(1);
        expect(property.getName).toBe("Property 1");
        expect(property.getDescription).toBe("Description of property 1");
        expect(property.getMaxGuests).toBe(2);
        expect(property.getBasePricePerNight).toBe(1000);
        expect(property.getType).toBe("house");
    });

    it("should throw an error if name is empty", () => {
        expect(() => new Property(1, "", "Description of property 1", 2, 1000, "house")).toThrow("Property name cannot be empty");
    });

    it("should throw an error if max guest count is zero or negative", () => {
        expect (() => {
            new Property(1, "Property 1", "Description of property 1", 0, 1000, "house")
        }).toThrow("Max guests must be greater than 0");
    });

    it("should throw an error if guest count exceeds max guest count", () => {
        const property = new Property(1, "Property 1", "Description of property 1", 2, 1000, "house");
        expect(() => property.validateGuestCount(3)).toThrow("Guest count exceeds max guest count");
    });

    it("should not apply discounts for less than 7 days", () => {
        const startDate = new Date("2021-01-01");
        const endDate = new Date("2021-01-06");
        const dateRange = new DateRange(startDate, endDate);

        const property = new Property(1, "Property 1", "Description of property 1", 2, 1000, "house");
        const totalPrice = property.calculateTotalPrice(dateRange);
        expect(totalPrice).toBe(5000);
    });
    
    it("must apply discounts for stays of 7 nights or more", () => {
        const startDate = new Date("2021-01-10");
        const endDate = new Date("2021-01-17");
        const dateRange = new DateRange(startDate, endDate);

        const property = new Property(1, "Property 1", "Description of property 1", 2, 100, "house");
        const totalPrice = property.calculateTotalPrice(dateRange);
        expect(totalPrice).toBe(630); // 7 nights * 100 / 10% discount = 630 
    });
});  