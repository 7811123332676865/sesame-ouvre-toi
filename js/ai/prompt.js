import { menu } from "../data/menu.js";

const menuText = JSON.stringify(
  menu.map((product) => ({ id: product.id, name: product.name }))
);

export const orderPrompt =
  "Tu prends les commandes au comptoir du café Sésame. " +
  "Le barista te donne la commande telle que le client l'a dite. " +
  "Voici la carte, au format JSON : " + menuText + ". " +
  "Pour chaque produit commandé, renvoie son id et sa quantité. " +
  "Utilise uniquement les produits de la carte. " +
  "Si un produit n'est pas sur la carte, ignore-le. " +
  "Si la phrase contient le prénom du client, renvoie-le dans customer. " +
  "Sinon, renvoie une chaîne vide dans customer.";
