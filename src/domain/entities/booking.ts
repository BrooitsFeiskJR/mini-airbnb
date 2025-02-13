import { Property } from "./property";
import { User } from "./user";
import { DateRange } from "../value_objects/date_range";

export class Booking {
    private readonly id: number;
    private readonly property: Property;
    private readonly user: User;
    private readonly dateRange: DateRange;
    private readonly guestCount: number

    constructor(
        id: number,
        property: Property,
        user: User,
        dateRange: DateRange,
        guestCount: number
    ) {
        this.id = id;
        this.property = property;
        this.user = user;
        this.dateRange = dateRange;
        this.guestCount = guestCount;
    }

    getId(): number {
        return this.id;
    }

    getProperty(): Property {
        return this.property;
    }

    getUser(): User {
        return this.user;
    }

    getDateRange(): DateRange {
        return this.dateRange;
    }

    getGuestCount(): number {
        return this.guestCount;
    }
}