import { order } from "../store/order.js";
import { checkout } from "../store/checkout.js";
import { formatPrice } from "../utils/format.js";
import { resetCustomerForm } from "./customerForm.js";
import { resetPromoForm } from "./promoForm.js";
import { printReceipt } from "./receipt.js";

const checkoutButton = document.querySelector("#checkout");
const checkoutMessage = document.querySelector("#checkout-message");

export function initCheckout(onChange) {
  checkoutButton.addEventListener("click", function () {
    if (order.isEmpty()) {
      checkoutMessage.classList.add("is-error");
      checkoutMessage.textContent = "Le ticket est vide, rien à encaisser.";
      return;
    }

    const receipt = checkout();

    checkoutMessage.classList.remove("is-error");
    checkoutMessage.textContent =
      "Ticket n° " + receipt.number + " encaissé : " + formatPrice(receipt.total);

    resetCustomerForm();
    resetPromoForm();
    onChange();
    printReceipt(receipt);
  });
}
