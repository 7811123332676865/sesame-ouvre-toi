import { findProduct } from "../../store/inventory.js";

const adviceBox = document.querySelector("#ai-advice");
const adviceText = document.querySelector("#ai-advice-text");
const adviceProducts = document.querySelector("#ai-advice-products");
const acceptButton = document.querySelector("#advice-accept");
const refuseButton = document.querySelector("#advice-refuse");

let suggestedIds = [];

export function showAdvice(ids, message) {
  suggestedIds = ids;
  adviceText.textContent = message;
  adviceProducts.textContent = "Proposé : " + ids.map((id) => findProduct(id).name).join(", ");
  adviceBox.classList.remove("is-hidden");
}

export function hideAdvice() {
  suggestedIds = [];
  adviceBox.classList.add("is-hidden");
}

export function initAdviceBox(onAccept) {
  acceptButton.addEventListener("click", function () {
    const ids = suggestedIds;
    hideAdvice();
    onAccept(ids);
  });

  refuseButton.addEventListener("click", hideAdvice);
}
