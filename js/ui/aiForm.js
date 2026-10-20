import { order } from "../store/order.js";
import { findProduct, getRemainingStock } from "../store/inventory.js";
import { askOrder } from "../ai/order.js";
import { fillCustomerForm } from "./customerForm.js";

const MAX_QUANTITY = 10;

const aiForm = document.querySelector("#ai-form");
const aiInput = document.querySelector("#ai-input");
const aiSubmit = document.querySelector("#ai-submit");
const aiMessage = document.querySelector("#ai-message");

function checkLine(line) {
  const product = findProduct(line.id);
  if (!product) {
    return "Produit inconnu (id " + line.id + ")";
  }

  if (!Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > MAX_QUANTITY) {
    return product.name + " : quantité " + line.quantity + " refusée (entre 1 et " + MAX_QUANTITY + ")";
  }

  const remaining = getRemainingStock(product);
  if (remaining === 0) {
    return product.name + " est épuisé";
  }

  if (line.quantity > remaining) {
    return "Il ne reste que " + remaining + " " + product.name;
  }

  return "";
}

function addLines(lines) {
  const refusals = [];

  for (const line of lines) {
    const refusal = checkLine(line);
    if (refusal !== "") {
      refusals.push(refusal);
      continue;
    }

    const product = findProduct(line.id);
    for (let i = 0; i < line.quantity; i++) {
      order.add(product);
    }
  }

  return refusals;
}

export function initAiForm(onChange) {
  aiForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const text = aiInput.value.trim();
    if (text === "") {
      return;
    }

    aiSubmit.disabled = true;
    aiMessage.classList.remove("is-error");
    aiMessage.textContent = "Qwen prend la commande…";

    try {
      const answer = await askOrder(text);
      const refusals = addLines(answer.lines);

      const customer = answer.customer.trim();
      if (customer !== "") {
        order.customer = customer;
        fillCustomerForm(customer);
      }

      aiInput.value = "";
      aiMessage.classList.toggle("is-error", refusals.length > 0);
      aiMessage.textContent = refusals.join(" · ");
      onChange();
    } catch {
      aiMessage.classList.add("is-error");
      aiMessage.textContent = "L'IA ne répond pas : prends la commande à la main.";
    }

    aiSubmit.disabled = false;
  });
}
