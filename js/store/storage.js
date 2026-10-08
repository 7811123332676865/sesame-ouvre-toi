import { menu } from "../data/menu.js";
import { order } from "./order.js";

const STORAGE_KEY = "sesame";

export const dayTickets = [];

function today() {
  return new Date().toDateString();
}

export function saveState() {
  const stocks = {};
  for (const product of menu) {
    stocks[product.id] = product.stock;
  }

  const state = {
    date: today(),
    number: order.number,
    customer: order.customer,
    promoCode: order.promoCode,
    lines: order.lines,
    dayTickets,
    stocks,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadState() {
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return;
  }

  if (!saved || saved.date !== today()) {
    return;
  }

  order.number = saved.number;
  order.customer = saved.customer ?? "";
  order.applyPromo(saved.promoCode ?? "");
  order.lines = saved.lines ?? [];
  dayTickets.push(...(saved.dayTickets ?? []));

  if (saved.stocks) {
    for (const product of menu) {
      if (saved.stocks[product.id] !== undefined) {
        product.stock = saved.stocks[product.id];
      }
    }
  }
}
