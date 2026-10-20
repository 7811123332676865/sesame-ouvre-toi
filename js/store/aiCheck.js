import { order } from "./order.js";
import { findProduct, getRemainingStock } from "./inventory.js";

const MAX_QUANTITY = 10;
const MAX_SUGGESTIONS = 2;

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

export function addLines(lines) {
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

export function keepAvailable(ids) {
  const kept = [];

  for (const id of ids) {
    const product = findProduct(id);
    if (product && getRemainingStock(product) > 0 && !kept.includes(id)) {
      kept.push(id);
    }
  }

  return kept.slice(0, MAX_SUGGESTIONS);
}
