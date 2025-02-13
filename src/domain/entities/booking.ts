import { Property } from "./property";
import { User } from "./user";
import { DateRange } from "../value_objects/date_range";
import { RefundRuleFactory } from "../cancelation/refund_rule_factory";

export class Booking {
  private readonly id: number;
  private readonly property: Property;
  private readonly user: User;
  private readonly dateRange: DateRange;
  private readonly guestCount: number;
  private status: "CONFIRMED" | "CANCELLED" = "CONFIRMED";
  private totalPrice: number;

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

    if (!property.isAvailable(dateRange)) {
      throw new Error("The property is not available for the selected period")
    }
    this.id = id;
    this.property = property;
    this.user = user;
    this.dateRange = dateRange;
    this.guestCount = guestCount;
    this.totalPrice = property.calculateTotalPrice(dateRange)

    // If has an class that can influent in test result. We should be warning!
    property.addBooking(this);
    property.validateGuestCount(this.guestCount)

  }

  get getTotalPrice(): number {
    return this.totalPrice;
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

  private setStatus(status: "CONFIRMED" | "CANCELLED"): void {
    this.status = status
  }

  cancel(currentDate: Date) {
    if (this.status == "CANCELLED") {
      throw new Error("This reservation is already cancel.")
    }

    const checkInDate = this.dateRange.getStartDate();

    const timeDiff = checkInDate.getTime() - currentDate.getTime();
    const daysUntilCheckin = Math.ceil(timeDiff / (1000 * 3600 * 24));

    const refundRule = RefundRuleFactory.getRefundRule(daysUntilCheckin)
    this.totalPrice = refundRule.calculateRefund(this.totalPrice);
    this.setStatus("CANCELLED")
  }
}
