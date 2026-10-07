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

    const remaining = getRemainingStock(product);

    const stock = document.createElement("p");
    stock.classList.add("product-stock");
    stock.textContent = "x" + remaining;
    if (remaining <= 3) {
      stock.classList.add("is-low");
    }

    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("product-add");
    button.textContent = "Ajouter";

    // Étape 2 · Les produits épuisés
    if (remaining === 0) {
      card.classList.add("is-sold-out");
      button.disabled = true;
    }

    button.addEventListener("click", function () {
      order.add(product);
      renderTicket();
      renderMenu(currentCategory);
    });

    if (remaining > 0) {
      card.append(category, name, price, stock, button);
    } else {
      card.append(category, name, price, button);
    }
    menuSection.append(card);
  }
}


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
      category: product.category,
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
const ticketDiscount = document.querySelector("#ticket-discount");
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
      renderMenu(currentCategory);
    });

    item.append(name, quantity, price, removeButton);
    ticketLines.append(item);
  }

  if (order.lines.length === 0) {
    ticketEmpty.classList.remove("is-hidden");
  } else {
    ticketEmpty.classList.add("is-hidden");
  }

  ticketDiscount.textContent = formatPrice(order.getDiscount());
  ticketTotal.textContent = formatPrice(order.getTotal());

  saveState();
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

let currentCategory = "all";

categoriesNav.addEventListener("click", function (event) {
  if (event.target.tagName !== "BUTTON") {
    return;
  }

  const buttons = categoriesNav.querySelectorAll("button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("is-active");
  }
  event.target.classList.add("is-active");

  currentCategory = event.target.value;
  renderMenu(currentCategory);
});


// Étape 7 · Le prénom du client
const customerForm = document.querySelector("#customer-form");
const customerInput = document.querySelector("#customer-name");
const customerError = document.querySelector("#customer-error");
const ticketTitle = document.querySelector("#ticket-title");

customerForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = customerInput.value.trim();

  if (name === "") {
    customerError.textContent = "Entre le prénom du client.";
    return;
  }

  customerError.textContent = "";
  order.customer = name;
  renderTicketTitle();
  saveState();
});


// Étape 8 · Le code promo
order.discountRate = 0;

order.getDiscount = function () {
  const formulaDiscount = this.getFormulaDiscount();
  const promoDiscount = Math.round((this.getSubtotal() - formulaDiscount) * this.discountRate);
  return formulaDiscount + promoDiscount;
};

order.getTotal = function () {
  return this.getSubtotal() - this.getDiscount();
};

const promoForm = document.querySelector("#promo-form");
const promoInput = document.querySelector("#promo-code");
const promoMessage = document.querySelector("#promo-message");

promoForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const code = promoInput.value.trim().toUpperCase();

  if (code === "BARISTA") {
    order.discountRate = 0.1;
    promoMessage.textContent = "Code BARISTA appliqué : 10 % de remise";
  } else {
    order.discountRate = 0;
    promoMessage.textContent = "Code inconnu";
  }

  renderTicket();
});


// Bonus
const checkoutButton = document.querySelector("#checkout");
const checkoutMessage = document.querySelector("#checkout-message");

order.number = 1;

function renderTicketTitle() {
  let title = "Ticket n° " + order.number;
  if (order.customer) {
    title += " de " + order.customer;
  }
  ticketTitle.textContent = title;
}

checkoutButton.addEventListener("click", function () {
  if (order.lines.length === 0) {
    checkoutMessage.classList.add("is-error");
    checkoutMessage.textContent = "Le ticket est vide, rien à encaisser.";
    return;
  }

  checkoutMessage.classList.remove("is-error");
  checkoutMessage.textContent =
    "Ticket n° " + order.number + " encaissé : " + formatPrice(order.getTotal());

  dayTickets.push({
    number: order.number,
    customer: order.customer,
    total: order.getTotal(),
  });

  for (let i = 0; i < order.lines.length; i++) {
    const product = findProduct(order.lines[i].id);
    product.stock -= order.lines[i].quantity;
  }

  order.lines = [];
  order.customer = "";
  order.discountRate = 0;
  order.number++;

  customerInput.value = "";
  customerError.textContent = "";
  promoInput.value = "";
  promoMessage.textContent = "";

  renderTicketTitle();
  renderTicket();
  renderDayTickets();
  renderMenu(currentCategory);
});

order.getFormulaDiscount = function () {
  let drinks = 0;
  let pastries = 0;

  for (let i = 0; i < this.lines.length; i++) {
    if (this.lines[i].category === "pastry") {
      pastries += this.lines[i].quantity;
    } else {
      drinks += this.lines[i].quantity;
    }
  }

  return Math.min(drinks, pastries) * 100;
};

const dayTicketsSection = document.querySelector("#day-tickets");
const dayTicketsList = document.querySelector("#day-tickets-list");

let dayTickets = [];

function renderDayTickets() {
  dayTicketsList.textContent = "";

  for (let i = 0; i < dayTickets.length; i++) {
    const ticket = dayTickets[i];

    const item = document.createElement("li");

    const label = document.createElement("span");
    label.textContent = "N° " + ticket.number;
    if (ticket.customer) {
      label.textContent += " · " + ticket.customer;
    }

    const total = document.createElement("span");
    total.textContent = formatPrice(ticket.total);

    item.append(label, total);
    dayTicketsList.append(item);
  }

  if (dayTickets.length === 0) {
    dayTicketsSection.classList.add("is-hidden");
  } else {
    dayTicketsSection.classList.remove("is-hidden");
  }
}

function saveState() {
  const stocks = {};
  for (let i = 0; i < menu.length; i++) {
    stocks[menu[i].id] = menu[i].stock;
  }

  const state = {
    date: new Date().toDateString(),
    lines: order.lines,
    customer: order.customer,
    discountRate: order.discountRate,
    number: order.number,
    dayTickets: dayTickets,
    stocks: stocks,
  };
  localStorage.setItem("sesame", JSON.stringify(state));
}

function loadState() {
  const saved = JSON.parse(localStorage.getItem("sesame"));

  if (saved === null || saved.date !== new Date().toDateString()) {
    return;
  }

  order.lines = saved.lines;
  order.customer = saved.customer;
  order.discountRate = saved.discountRate;
  order.number = saved.number;
  dayTickets = saved.dayTickets;

  if (saved.stocks) {
    for (let i = 0; i < menu.length; i++) {
      if (saved.stocks[menu[i].id] !== undefined) {
        menu[i].stock = saved.stocks[menu[i].id];
      }
    }
  }

  if (order.customer) {
    customerInput.value = order.customer;
  }

  if (order.discountRate > 0) {
    promoInput.value = "BARISTA";
    promoMessage.textContent = "Code BARISTA appliqué : 10 % de remise";
  }
}

function findProduct(id) {
  for (let i = 0; i < menu.length; i++) {
    if (menu[i].id === id) {
      return menu[i];
    }
  }
}

function getRemainingStock(product) {
  for (let i = 0; i < order.lines.length; i++) {
    if (order.lines[i].id === product.id) {
      return product.stock - order.lines[i].quantity;
    }
  }
  return product.stock;
}

loadState();
renderMenu();
renderTicketTitle();
renderTicket();
renderDayTickets();
