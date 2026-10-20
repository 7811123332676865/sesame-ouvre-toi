const OLLAMA_URL = "http://localhost:11434/api/chat";
const MODEL = "qwen3.5:4b";

export async function askModel(messages, format) {
  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages: messages,
      format: format,
      stream: false,
      think: false,
    }),
  });

  const data = await response.json();
  return data.message.content;
}
