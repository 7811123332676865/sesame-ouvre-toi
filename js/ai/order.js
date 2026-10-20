import { askModel } from "./model.js";
import { orderPrompt } from "./prompt.js";

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
  },
  required: ["lines"],
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
