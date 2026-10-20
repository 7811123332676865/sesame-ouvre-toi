import { menu } from "../data/menu.js";
import { askModel } from "./ollama.js";

const menuText = JSON.stringify(
  menu.map((product) => ({ id: product.id, name: product.name }))
);

const orderPrompt =
  "Tu prends les commandes au comptoir du café Sésame. " +
  "Le barista te donne la commande telle que le client l'a dite. " +
  "Voici la carte, au format JSON : " + menuText + ". " +
  "Pour chaque produit commandé, renvoie son id et sa quantité. " +
  "Utilise uniquement les produits de la carte. " +
  "Si un produit n'est pas sur la carte, ignore-le. " +
  "Si la phrase contient le prénom du client, renvoie-le dans customer. " +
  "Sinon, renvoie une chaîne vide dans customer. " +
  "Si le client ne nomme aucun produit et demande plutôt un conseil ou décrit une envie, " +
  "renvoie intent \"advice\" et une liste lines vide. Sinon, renvoie intent \"order\".";

const orderFormat = {
  type: "object",
  properties: {
    lines: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          quantity: { type: "integer" },
        },
        required: ["id", "quantity"],
      },
    },
    customer: { type: "string" },
    intent: { type: "string", enum: ["order", "advice"] },
  },
  required: ["lines", "customer", "intent"],
};

export async function askOrder(text) {
  const answer = await askModel(
    [
      { role: "system", content: orderPrompt },
      { role: "user", content: text },
    ],
    orderFormat
  );

  return JSON.parse(answer);
}
