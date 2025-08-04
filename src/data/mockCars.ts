import { Car } from "@/types/car";

export const mockCars: Car[] = [
  {
    id: "1",
    brand: "Toyota",
    model: "Corolla",
    year: 2022,
    image: "https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=500&h=300&fit=crop",
    status: "available",
    dailyRate: 120,
    features: ["Ar Condicionado", "Direção Hidráulica", "Vidros Elétricos"],
    fuel: "Flex",
    transmission: "Manual"
  },
  {
    id: "2",
    brand: "Honda",
    model: "Civic",
    year: 2023,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&h=300&fit=crop",
    status: "available",
    dailyRate: 140,
    features: ["Ar Condicionado", "Câmbio Automático", "Central Multimídia"],
    fuel: "Flex",
    transmission: "Automático"
  },
  {
    id: "3",
    brand: "Volkswagen",
    model: "Polo",
    year: 2021,
    image: "https://images.unsplash.com/photo-1494976502875-4593fd5c3b2a?w=500&h=300&fit=crop",
    status: "available",
    dailyRate: 100,
    features: ["Ar Condicionado", "Direção Elétrica"],
    fuel: "Flex",
    transmission: "Manual"
  },
  {
    id: "4",
    brand: "Chevrolet",
    model: "Onix",
    year: 2022,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop",
    status: "available",
    dailyRate: 90,
    features: ["Ar Condicionado", "Vidros Elétricos"],
    fuel: "Flex",
    transmission: "Manual"
  },
  {
    id: "5",
    brand: "Hyundai",
    model: "HB20",
    year: 2023,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=300&fit=crop",
    status: "available",
    dailyRate: 95,
    features: ["Ar Condicionado", "Central Multimídia", "Bluetooth"],
    fuel: "Flex",
    transmission: "Manual"
  },
  {
    id: "6",
    brand: "Ford",
    model: "Ka",
    year: 2021,
    image: "https://images.unsplash.com/photo-1549399264-0c0d4ba57551?w=500&h=300&fit=crop",
    status: "available",
    dailyRate: 85,
    features: ["Ar Condicionado", "Direção Hidráulica"],
    fuel: "Flex",
    transmission: "Manual"
  }
];