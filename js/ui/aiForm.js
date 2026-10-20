import { order } from "../store/order.js";
import { findProduct } from "../store/inventory.js";
import { askOrder } from "../ai/order.js";

const aiForm = document.querySelector("#ai-form");
const aiInput = document.querySelector("#ai-input");
const aiSubmit = document.querySelector("#ai-submit");
const aiMessage = document.querySelector("#ai-message");

export function initAiForm(onChange) {
  aiForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const text = aiInput.value.trim();
    if (text === "") {
      return;
    }

    aiSubmit.disabled = true;
    aiMessage.textContent = "Qwen prend la commande…";

    const answer = await askOrder(text);

    for (const line of answer.lines) {
      const product = findProduct(line.id);
      for (let i = 0; i < line.quantity; i++) {
        order.add(product);
      }
    }

    aiInput.value = "";
    aiMessage.textContent = "";
    aiSubmit.disabled = false;
    onChange();
  });
}
