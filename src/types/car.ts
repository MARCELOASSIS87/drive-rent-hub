export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  image: string;
  status: "available" | "rented" | "maintenance";
  dailyRate: number;
  features: string[];
  fuel: string;
  transmission: string;
}

export interface RentalRequest {
  id: string;
  carId: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}