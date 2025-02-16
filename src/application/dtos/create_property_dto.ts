export interface CreatePropertyDTO {
    id: number;
    name: string;
    description: string;
    maxGuests: number;
    basePricePerNight: number;
    type: string;
}