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

function renderMenu() {
  menuSection.textContent = "";

  for (let i = 0; i < menu.length; i++) {
    const product = menu[i];

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


// Étape 5 · Retirer une ligne


// Étape 6 · Filtrer par catégorie


// Étape 7 · Le prénom du client


// Étape 8 · Le code promo


// Bonus
