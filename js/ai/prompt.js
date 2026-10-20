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
  "Sinon, renvoie une chaîne vide dans customer. " +
  "Si le client ne nomme aucun produit et demande plutôt un conseil ou décrit une envie, " +
  "renvoie intent \"advice\" et une liste lines vide. Sinon, renvoie intent \"order\".";

export function buildAdvicePrompt(products) {
  const productsText = JSON.stringify(
    products.map((product) => ({ id: product.id, name: product.name, category: product.category }))
  );

  return (
    "Tu es le barista du café Sésame et tu conseilles un client qui hésite. " +
    "Voici les produits disponibles, au format JSON : " + productsText + ". " +
    "Choisis au plus deux produits de cette liste qui correspondent à l'envie du client. " +
    "Renvoie leurs id dans ids, et une phrase courte en français dans message pour expliquer ton choix. " +
    "Dans message, cite exactement les produits dont tu renvoies les id, avec leur nom de la liste. " +
    "Écris message en texte simple, sans markdown, sans astérisques, sans emoji et sans jamais écrire les id."
  );
}
