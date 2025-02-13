// After create this object you can not change the start and end date, you can only get them.
// If you want to change the start and end date you need to create a new DateRange object.
export class DateRange {
  private readonly startDate: Date;
  private readonly endDate: Date;

  constructor(startDate: Date, endDate: Date) {
    if (endDate < startDate) {
      throw new Error("end date should not be lower the startDate")
    } 
    if (endDate == startDate) {
      throw new Error("end date should not be the same as the startDate")
    }
    this.startDate = startDate;
    this.endDate = endDate;
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
