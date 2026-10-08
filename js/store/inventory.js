import { menu } from "../data/menu.js";
import { order } from "./order.js";

export function findProduct(id) {
  return menu.find((product) => product.id === id);
}

export function getRemainingStock(product) {
  return product.stock - order.quantityOf(product.id);
}

export function consumeStock(lines) {
  for (const line of lines) {
    findProduct(line.id).stock -= line.quantity;
  }
}
