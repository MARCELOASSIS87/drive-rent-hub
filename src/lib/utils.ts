import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatCurrencyBR(value: number | string) {
  const number = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(number)) return "R$ 0,00"
  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}