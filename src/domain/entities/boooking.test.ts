import { Booking } from "./booking";
import { Property } from "./property";
import { User } from "./user";
import { DateRange } from "../value_objects/date_range";

describe("Booking Entity", () => {
    it("should create a booking", () => {
        const property = new Property(1, "Property 1", "Description of property 1", 4, 1000, "house");
        const user = new User("1", "John Doe")
        const dateRange = new DateRange(new Date("2021-01-01"), new Date("2021-01-06"));

        const booking = new Booking(1, property, user, dateRange, 2);

        expect(booking.getId).toBe(1);
        expect(booking.getProperty).toBe(property);
        expect(booking.getUser).toBe(user);
        expect(booking.getDateRange).toBe(dateRange);
        expect(booking.getGuestCount).toBe(2);
        expect(booking.getStatus).toBe("CONFIRMED")
    });
});