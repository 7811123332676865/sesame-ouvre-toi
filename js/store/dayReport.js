import { dayTickets } from "./storage.js";

export function getDayReport() {
  let total = 0;
  for (const ticket of dayTickets) {
    total += ticket.total;
  }

  const count = dayTickets.length;

  return {
    tickets: dayTickets,
    count,
    total,
    average: count > 0 ? Math.round(total / count) : 0,
    printedAt: new Date(),
  };
}
