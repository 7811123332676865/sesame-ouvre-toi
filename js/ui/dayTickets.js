import { dayTickets } from "../store/storage.js";
import { formatPrice } from "../utils/format.js";

const dayTicketsSection = document.querySelector("#day-tickets");
const dayTicketsList = document.querySelector("#day-tickets-list");

function createDayTicket(ticket) {
  const item = document.createElement("li");

  const label = document.createElement("span");
  label.textContent = "N° " + ticket.number;
  if (ticket.customer) {
    label.textContent += " · " + ticket.customer;
  }

  const total = document.createElement("span");
  total.textContent = formatPrice(ticket.total);

  item.append(label, total);
  return item;
}

export function renderDayTickets() {
  dayTicketsList.textContent = "";
  for (const ticket of dayTickets) {
    dayTicketsList.append(createDayTicket(ticket));
  }

  dayTicketsSection.classList.toggle("is-hidden", dayTickets.length === 0);
}
