import { order } from "../store/order.js";

const customerForm = document.querySelector("#customer-form");
const customerInput = document.querySelector("#customer-name");
const customerError = document.querySelector("#customer-error");

export function resetCustomerForm() {
  customerInput.value = "";
  customerError.textContent = "";
}

export function initCustomerForm(onChange) {
  customerInput.value = order.customer;

  customerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = customerInput.value.trim();
    if (name === "") {
      customerError.textContent = "Entre le prénom du client.";
      return;
    }

    customerError.textContent = "";
    order.customer = name;
    onChange();
  });
}
