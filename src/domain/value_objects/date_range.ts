// After create this object you can not change the start and end date, you can only get them.
// If you want to change the start and end date you need to create a new DateRange object.
export class DateRange {
  private readonly startDate: Date;
  private readonly endDate: Date;

  constructor(startDate: Date, endDate: Date) {
    this.validateDateRange(startDate, endDate);
    this.startDate = startDate;
    this.endDate = endDate;
  }

  private validateDateRange(startDate: Date, endDate: Date): void {
    if (endDate < startDate) {
        throw new Error("end date should not be lower than startDate");
    }
    if (startDate === endDate) {
        throw new Error("start date and end date should not be the same");
    }
  }

  getStartDate(): Date {
    return this.startDate;
  } 
  getEndDate(): Date {
    return this.endDate;
  }
  getTotalNights(): number {
    const day = 1000 * 3600 * 24;
    const diffTime = this.endDate.getTime() - this.startDate.getTime();
    return Math.ceil(diffTime / day);
  }
  overLaps(other: DateRange): boolean {
    return this.startDate < other.getEndDate() && this.endDate > other.getStartDate();
  }
}
