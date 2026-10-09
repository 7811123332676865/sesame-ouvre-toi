import { order } from "./order.js";
import { dayTickets } from "./storage.js";
import { consumeStock } from "./inventory.js";

export function checkout() {
  const ticket = {
    number: order.number,
    customer: order.customer,
    total: order.getTotal(),
  };

  const receipt = {
    ...ticket,
    lines: order.lines,
    subtotal: order.getSubtotal(),
    discount: order.getDiscount(),
    paidAt: new Date(),
  };

  dayTickets.push(ticket);
  consumeStock(order.lines);
  order.next();

  return receipt;
}
