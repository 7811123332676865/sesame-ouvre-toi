import { order } from "../../store/order.js";
import { addLines, keepAvailable } from "../../store/aiCheck.js";
import { askOrder } from "../../ai/order.js";
import { askAdvice } from "../../ai/advice.js";
import { fillCustomerForm } from "../ticket/customerForm.js";
import { initAdviceBox, showAdvice, hideAdvice } from "./adviceBox.js";

const aiForm = document.querySelector("#ai-form");
const aiInput = document.querySelector("#ai-input");
const aiSubmit = document.querySelector("#ai-submit");
const aiMessage = document.querySelector("#ai-message");

function showRefusals(refusals) {
  aiMessage.classList.toggle("is-error", refusals.length > 0);
  aiMessage.textContent = refusals.join(", ");
}

function takeOrder(answer) {
  hideAdvice();
  showRefusals(addLines(answer.lines));

  const customer = answer.customer.trim();
  if (customer !== "") {
    order.customer = customer;
    fillCustomerForm(customer);
  }
}

async function giveAdvice(text) {
  aiMessage.textContent = "Qwen cherche un conseil…";

  const advice = await askAdvice(text);
  const ids = keepAvailable(advice.ids);

  if (ids.length === 0) {
    hideAdvice();
    aiMessage.textContent = "Qwen n'a rien trouvé de disponible pour cette envie.";
    return;
  }

  aiMessage.textContent = "";
  showAdvice(ids, advice.message);
}

export function initAiForm(onChange) {
  initAdviceBox(function (ids) {
    const lines = ids.map((id) => ({ id: id, quantity: 1 }));
    showRefusals(addLines(lines));
    onChange();
  });

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

      if (answer.intent === "advice") {
        await giveAdvice(text);
      } else {
        takeOrder(answer);
      }

      aiInput.value = "";
      onChange();
    } catch {
      aiMessage.classList.add("is-error");
      aiMessage.textContent = "L'IA ne répond pas : prends la commande à la main.";
    }

    aiSubmit.disabled = false;
  });
}
