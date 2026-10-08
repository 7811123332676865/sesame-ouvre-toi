import { order } from "../store/order.js";
import { formatPrice } from "../utils/format.js";

const ticketTitle = document.querySelector("#ticket-title");
const ticketLines = document.querySelector("#ticket-lines");
const ticketEmpty = document.querySelector("#ticket-empty");
const ticketDiscount = document.querySelector("#ticket-discount");
const ticketTotal = document.querySelector("#ticket-total");

function createTicketLine(line) {
  const item = document.createElement("li");
  item.classList.add("ticket-line");

  const name = document.createElement("span");
  name.classList.add("line-name");
  name.textContent = line.name;

  const quantity = document.createElement("span");
  quantity.classList.add("line-qty");
  quantity.textContent = "× " + line.quantity;

  const price = document.createElement("span");
  price.classList.add("line-price");
  price.textContent = formatPrice(line.price * line.quantity);

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.classList.add("line-remove");
  removeButton.dataset.id = line.id;
  removeButton.setAttribute("aria-label", "Retirer un " + line.name);
  removeButton.textContent = "−";

  item.append(name, quantity, price, removeButton);
  return item;
}

function renderTitle() {
  let title = "Ticket n° " + order.number;
  if (order.customer) {
    title += " de " + order.customer;
  }
  ticketTitle.textContent = title;
}

export function renderTicket() {
  renderTitle();

  ticketLines.textContent = "";
  for (const line of order.lines) {
    ticketLines.append(createTicketLine(line));
  }

  ticketEmpty.classList.toggle("is-hidden", !order.isEmpty());
  ticketDiscount.textContent = formatPrice(order.getDiscount());
  ticketTotal.textContent = formatPrice(order.getTotal());
}

export function initTicket(onChange) {
  ticketLines.addEventListener("click", function (event) {
    const button = event.target.closest(".line-remove");
    if (!button) {
      return;
    }

    order.remove(Number(button.dataset.id));
    onChange();
  });
}
