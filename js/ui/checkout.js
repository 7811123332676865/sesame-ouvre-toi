import { order } from "../store/order.js";
import { checkout } from "../store/checkout.js";
import { formatPrice } from "../utils/format.js";
import { resetCustomerForm } from "./customerForm.js";
import { resetPromoForm } from "./promoForm.js";

const checkoutButton = document.querySelector("#checkout");
const checkoutMessage = document.querySelector("#checkout-message");

export function initCheckout(onChange) {
  checkoutButton.addEventListener("click", function () {
    if (order.isEmpty()) {
      checkoutMessage.classList.add("is-error");
      checkoutMessage.textContent = "Le ticket est vide, rien à encaisser.";
      return;
    }

    const ticket = checkout();

    checkoutMessage.classList.remove("is-error");
    checkoutMessage.textContent =
      "Ticket n° " + ticket.number + " encaissé : " + formatPrice(ticket.total);

    resetCustomerForm();
    resetPromoForm();
    onChange();
  });
}
