import { menu } from "../data/menu.js";
import { getRemainingStock } from "../store/inventory.js";
import { askModel } from "./model.js";
import { buildAdvicePrompt } from "./prompt.js";

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
