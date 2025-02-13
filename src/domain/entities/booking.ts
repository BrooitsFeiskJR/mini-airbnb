import { Property } from "./property";
import { User } from "./user";
import { DateRange } from "../value_objects/date_range";

export class Booking {
    private readonly id: number;
    private readonly property: Property;
    private readonly user: User;
    private readonly dateRange: DateRange;
    private readonly guestCount: number;
    private readonly status: "CONFIRMED" | "CANCELLED" = "CONFIRMED"

    constructor(
        id: number,
        property: Property,
        user: User,
        dateRange: DateRange,
        guestCount: number,
    ) {
        if (guestCount <= 0) {
            throw new Error("The number of guest must be greater than zero")
        }
        this.id = id;
        this.property = property;
        this.user = user;
        this.dateRange = dateRange;
        this.guestCount = guestCount;

        property.addBooking(this);
    }

    get getId(): number {
        return this.id;
    }

    get getProperty(): Property {
        return this.property;
    }

    get getUser(): User {
        return this.user;
    }

    get getDateRange(): DateRange {
        return this.dateRange;
    }

    get getGuestCount(): number {
        return this.guestCount;
    }

    get getStatus(): "CONFIRMED" | "CANCELLED" {
        return this.status
    }
}