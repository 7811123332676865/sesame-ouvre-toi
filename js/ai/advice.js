import { menu } from "../data/menu.js";
import { getRemainingStock } from "../store/inventory.js";
import { askModel } from "./ollama.js";

function buildAdvicePrompt(products) {
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

const adviceFormat = {
  type: "object",
  properties: {
    ids: {
      type: "array",
      items: { type: "integer" },
    },
    message: { type: "string" },
  },
  required: ["ids", "message"],
};

export async function askAdvice(text) {
  const available = menu.filter((product) => getRemainingStock(product) > 0);

  const answer = await askModel(
    [
      { role: "system", content: buildAdvicePrompt(available) },
      { role: "user", content: text },
    ],
    adviceFormat
  );

  return JSON.parse(answer);
}
