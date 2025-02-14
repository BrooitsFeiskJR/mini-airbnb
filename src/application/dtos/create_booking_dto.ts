// SOLID
// SRP - Single Responsibility Principle
// Create DTO (Data Transfer Object) based on the responsibility of each
export interface CreateBookingDTO {
  propertyId: number;
  guestId: string;
  startDate: Date;
  endDate: Date;
  guestCount: number;
}


