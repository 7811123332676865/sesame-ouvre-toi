import { order } from "../store/order.js";

const promoForm = document.querySelector("#promo-form");
const promoInput = document.querySelector("#promo-code");
const promoMessage = document.querySelector("#promo-message");

function appliedMessage() {
  return "Code " + order.promoCode + " appliqué : " + order.getPromoRate() * 100 + " % de remise";
}

export function resetPromoForm() {
  promoInput.value = "";
  promoMessage.textContent = "";
}

export function initPromoForm(onChange) {
  if (order.promoCode) {
    promoInput.value = order.promoCode;
    promoMessage.textContent = appliedMessage();
  }

  promoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const code = promoInput.value.trim().toUpperCase();
    promoMessage.textContent = order.applyPromo(code) ? appliedMessage() : "Code inconnu";
    onChange();
  });
}
