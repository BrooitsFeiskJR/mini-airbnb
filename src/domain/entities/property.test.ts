import { Property } from './property';
import { DateRange } from '../value_objects/date_range';
import { Booking } from './booking';
import { User } from './user';

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
    expect(() => {
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

  it("should check if the property is available for the given date range", () => {
    const user = new User("1", "John Doe");
    const property = new Property(1, "Property 1", "Description of property 1", 2, 1000, "house");

    const dateRange = new DateRange(new Date("2024-12-20"), new Date("2024-12-25"));
    const dateRange2 = new DateRange(new Date("2024-12-22"), new Date("2024-12-27"));
    const dateRange3 = new DateRange(new Date("2024-12-15"), new Date("2024-12-19"));

    new Booking(1, property, user, dateRange, 2);

    expect(property.isAvailable(dateRange)).toBe(false);
    expect(property.isAvailable(dateRange2)).toBe(false);
    expect(property.isAvailable(dateRange3)).toBe(true);
  });

  it("should test with the booking is push to the list of bookings", () => {
    const user = new User("1", "John Doe");
    const property = new Property(1, "Property 1", "Description of property 1", 2, 1000, "house");
    const dateRange = new DateRange(new Date("2024-12-20"), new Date("2024-12-25"));

    const booking = new Booking(1, property, user, dateRange, 2);

    expect(property.getBookings).toContain(booking);
  });

  it("must cancel a reservation without refund when there is less than a day until check in", () => {
    const user = new User("1", "John Doe");
    const property = new Property(1, "Property 1", "Description of property 1", 2, 1000, "house");
    const dateRange = new DateRange(new Date("2024-12-20"), new Date("2024-12-22"));

    const booking = new Booking(1, property, user, dateRange, 2);

    const currentDate = new Date("2024-12-20")
    booking.cancel(currentDate);

    expect(booking.getStatus).toBe("CANCELLED")
    expect(booking.getTotalPrice).toBe(2000)
  })


  it("must cancel a reservation with a full refund when the date is more than 7 days from check-in", () => {
    const user = new User("1", "John Doe");
    const property = new Property(1, "Property 1", "Description of property 1", 2, 1000, "house");
    const dateRange = new DateRange(new Date("2024-12-20"), new Date("2024-12-22"));

    const booking = new Booking(1, property, user, dateRange, 2);

    const currentDate = new Date("2024-12-10")
    booking.cancel(currentDate);

    expect(booking.getStatus).toBe("CANCELLED")
    expect(booking.getTotalPrice).toBe(0)
  })

  it("must cancel a reservation with a parcial refund when the date is 1 at 7 days from check-in", () => {
    const user = new User("1", "John Doe");
    const property = new Property(1, "Property 1", "Description of property 1", 2, 1000, "house");
    const dateRange = new DateRange(new Date("2024-12-20"), new Date("2024-12-22"));

    const booking = new Booking(1, property, user, dateRange, 2);

    const currentDate = new Date("2024-12-15")
    booking.cancel(currentDate);

    expect(booking.getStatus).toBe("CANCELLED")
    expect(booking.getTotalPrice).toBe(2000 * 0.5)
  })

  it("should not allow cancel a reservation more than one time", () => {
    const user = new User("1", "John Doe");
    const property = new Property(1, "Property 1", "Description of property 1", 2, 1000, "house");
    const dateRange = new DateRange(new Date("2024-12-20"), new Date("2024-12-22"));

    const booking = new Booking(1, property, user, dateRange, 2);

    const currentDate = new Date("2024-12-10")
    booking.cancel(currentDate);

    expect(() => {
      booking.cancel(currentDate);
    }).toThrow("This reservation is already cancel.")
  })
});     
