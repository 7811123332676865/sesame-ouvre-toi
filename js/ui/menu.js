import { menu } from "../data/menu.js";
import { order } from "../store/order.js";
import { findProduct, getRemainingStock } from "../store/inventory.js";
import { formatPrice } from "../utils/format.js";

const LOW_STOCK = 3;

const categoryLabels = {
  coffee: "Café",
  tea: "Thé & autres",
  pastry: "Pâtisserie",
};

const menuSection = document.querySelector("#menu");
const categoriesNav = document.querySelector("#categories");

let currentCategory = "all";

function createProductCard(product) {
  const remaining = getRemainingStock(product);

  const card = document.createElement("article");
  card.classList.add("product");

  const category = document.createElement("span");
  category.classList.add("product-category");
  category.textContent = categoryLabels[product.category];

  const name = document.createElement("h3");
  name.classList.add("product-name");
  name.textContent = product.name;

  const price = document.createElement("p");
  price.classList.add("product-price");
  price.textContent = formatPrice(product.price);

  const button = document.createElement("button");
  button.type = "button";
  button.classList.add("product-add");
  button.dataset.id = product.id;
  button.textContent = "Ajouter";

  if (remaining === 0) {
    card.classList.add("is-sold-out");
    button.disabled = true;
    card.append(category, name, price, button);
    return card;
  }

  const stock = document.createElement("p");
  stock.classList.add("product-stock");
  stock.textContent = "x" + remaining;
  if (remaining <= LOW_STOCK) {
    stock.classList.add("is-low");
  }

  card.append(category, name, price, stock, button);
  return card;
}

export function renderMenu() {
  menuSection.textContent = "";

  for (const product of menu) {
    if (currentCategory === "all" || product.category === currentCategory) {
      menuSection.append(createProductCard(product));
    }
  }
}

export function initMenu(onChange) {
  menuSection.addEventListener("click", function (event) {
    const button = event.target.closest(".product-add");
    if (!button) {
      return;
    }

    order.add(findProduct(Number(button.dataset.id)));
    onChange();
  });

  categoriesNav.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button) {
      return;
    }

    for (const other of categoriesNav.querySelectorAll("button")) {
      other.classList.remove("is-active");
    }
    button.classList.add("is-active");

    currentCategory = button.value;
    renderMenu();
  });
}
