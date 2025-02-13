import { DateRange } from "./date_range";

describe('DateRange Value Object', () => {
  it("should create new DateRange instance", () => {
    const startDate = new Date('2024-12-20');
    const endDate = new Date('2024-12-25');
    const dateRange = new DateRange(startDate, endDate);
    expect(dateRange.getStartDate()).toEqual(startDate);
    expect(dateRange.getEndDate()).toEqual(endDate);
  });

  it('should throw an error if finish date is before start date', () => {
    expect(() => {
      new DateRange(new Date('2024-12-25'), new Date('2024-12-20'));
    }).toThrow("end date should not be lower the startDate");
  });

  it('should calculate the total of nights between two dates', () => {
    const startDate = new Date('2024-12-20');
    const endDate = new Date('2024-12-25');
    const dateRange = new DateRange(startDate, endDate);

    const totalNights = dateRange.getTotalNights();
    expect(totalNights).toBe(5);

    const startDate1 = new Date('2024-12-10');
    const endDate1 = new Date('2024-12-25');
    const dateRange1 = new DateRange(startDate1, endDate1);

    const totalNights1 = dateRange1.getTotalNights();
    expect(totalNights1).toBe(15);
  }); 

  it("should verify if two date ranges overlap", () => {
    const dateRange1 = new DateRange(new Date('2024-12-20'), new Date('2024-12-25'));
    const dateRange2 = new DateRange(new Date('2024-12-22'), new Date('2024-12-27'));
    const overlaps = dateRange1.overLaps(dateRange2);
    expect(overlaps).toBe(true);
  });

  // This is a edge case, the start date and end date are the same
  it("should throw an error if the start date and end date are the same", () => {
    const date = new Date('2024-12-20');
    expect(() => {
      new DateRange(date, date);
    }).toThrow("end date should not be lower the startDate");
  });
});
