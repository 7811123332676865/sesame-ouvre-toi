// Fournie : transforme 220 en "2,20 €". Tu n'as pas à la modifier.
function formatPrice(cents) {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}


// Étape 1 · Afficher la carte
const menuSection = document.querySelector("#menu");

function categoryLabel(category) {
  if (category === "coffee") {
    return "Café";
  }
  if (category === "tea") {
    return "Thé & autres";
  }
  return "Pâtisserie";
}

function renderMenu(selectedCategory = "all") {
  menuSection.textContent = "";

  for (let i = 0; i < menu.length; i++) {
    const product = menu[i];

    if (selectedCategory !== "all" && product.category !== selectedCategory) {
      continue;
    }

    const card = document.createElement("article");
    card.classList.add("product");

    const category = document.createElement("span");
    category.classList.add("product-category");
    category.textContent = categoryLabel(product.category);

    const name = document.createElement("h3");
    name.classList.add("product-name");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.classList.add("product-price");
    price.textContent = formatPrice(product.price);

    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("product-add");
    button.textContent = "Ajouter";

    // Étape 2 · Les produits épuisés
    if (!product.available) {
      card.classList.add("is-sold-out");
      button.disabled = true;
    }

    button.addEventListener("click", function () {
      order.add(product);
      renderTicket();
    });

    card.append(category, name, price, button);
    menuSection.append(card);
  }
}

renderMenu();


// Étape 3 · L'objet order
const order = {
  lines: [],

  add(product) {
    for (let i = 0; i < this.lines.length; i++) {
      if (this.lines[i].id === product.id) {
        this.lines[i].quantity++;
        return;
      }
    }

    this.lines.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  },

  getSubtotal() {
    let subtotal = 0;
    for (let i = 0; i < this.lines.length; i++) {
      subtotal += this.lines[i].price * this.lines[i].quantity;
    }
    return subtotal;
  },
};


// Étape 4 · Afficher le ticket
const ticketLines = document.querySelector("#ticket-lines");
const ticketEmpty = document.querySelector("#ticket-empty");
const ticketTotal = document.querySelector("#ticket-total");

function renderTicket() {
  ticketLines.textContent = "";

  for (let i = 0; i < order.lines.length; i++) {
    const line = order.lines[i];

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
    removeButton.setAttribute("aria-label", "Retirer un " + line.name);
    removeButton.textContent = "−";
    removeButton.addEventListener("click", function () {
      order.remove(line.id);
      renderTicket();
    });

    item.append(name, quantity, price, removeButton);
    ticketLines.append(item);
  }

  if (order.lines.length === 0) {
    ticketEmpty.classList.remove("is-hidden");
  } else {
    ticketEmpty.classList.add("is-hidden");
  }

  ticketTotal.textContent = formatPrice(order.getSubtotal());
}


// Étape 5 · Retirer une ligne
order.remove = function (id) {
  for (let i = 0; i < this.lines.length; i++) {
    if (this.lines[i].id === id) {
      this.lines[i].quantity--;
      if (this.lines[i].quantity === 0) {
        this.lines.splice(i, 1);
      }
      return;
    }
  }
};


// Étape 6 · Filtrer par catégorie
const categoriesNav = document.querySelector("#categories");

categoriesNav.addEventListener("click", function (event) {
  if (event.target.tagName !== "BUTTON") {
    return;
  }

  const buttons = categoriesNav.querySelectorAll("button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("is-active");
  }
  event.target.classList.add("is-active");

  renderMenu(event.target.value);
});


// Étape 7 · Le prénom du client


// Étape 8 · Le code promo


// Bonus
