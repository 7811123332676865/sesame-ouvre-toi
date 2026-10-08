const COMBO_DISCOUNT = 100;

const promoCodes = {
  BARISTA: 0.1,
};

export const order = {
  number: 1,
  customer: "",
  promoCode: "",
  lines: [],

  isEmpty() {
    return this.lines.length === 0;
  },

  findLine(id) {
    return this.lines.find((line) => line.id === id);
  },

  quantityOf(id) {
    const line = this.findLine(id);
    return line ? line.quantity : 0;
  },

  add(product) {
    const line = this.findLine(product.id);
    if (line) {
      line.quantity++;
      return;
    }

    this.lines.push({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      quantity: 1,
    });
  },

  remove(id) {
    const index = this.lines.findIndex((line) => line.id === id);
    if (index === -1) {
      return;
    }

    this.lines[index].quantity--;
    if (this.lines[index].quantity === 0) {
      this.lines.splice(index, 1);
    }
  },

  applyPromo(code) {
    this.promoCode = Object.hasOwn(promoCodes, code) ? code : "";
    return this.promoCode !== "";
  },

  getPromoRate() {
    return promoCodes[this.promoCode] ?? 0;
  },

  getSubtotal() {
    let subtotal = 0;
    for (const line of this.lines) {
      subtotal += line.price * line.quantity;
    }
    return subtotal;
  },

  getComboDiscount() {
    let drinks = 0;
    let pastries = 0;

    for (const line of this.lines) {
      if (line.category === "pastry") {
        pastries += line.quantity;
      } else {
        drinks += line.quantity;
      }
    }

    return Math.min(drinks, pastries) * COMBO_DISCOUNT;
  },

  getDiscount() {
    const comboDiscount = this.getComboDiscount();
    const promoDiscount = Math.round((this.getSubtotal() - comboDiscount) * this.getPromoRate());
    return comboDiscount + promoDiscount;
  },

  getTotal() {
    return this.getSubtotal() - this.getDiscount();
  },

  next() {
    this.lines = [];
    this.customer = "";
    this.promoCode = "";
    this.number++;
  },
};
