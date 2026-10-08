import { order } from "./order.js";
import { dayTickets } from "./storage.js";
import { consumeStock } from "./inventory.js";

export function checkout() {
  const ticket = {
    number: order.number,
    customer: order.customer,
    total: order.getTotal(),
  };

  dayTickets.push(ticket);
  consumeStock(order.lines);
  order.next();

  return ticket;
}
