import { DiscussServiceClient } from "@google-cloud/generativelanguage";
import { GoogleAuth } from "google-auth-library";
import * as dotenv from "dotenv";

const MODEL_NAME = "models/chat-bison-001";

class Chat {
  model;
  api_key;
  temperature;
  candidateCount;

  constructor({ model, api_key, temperature = 0.5, candidateCount = 1 }) {
    this.model = model;
    this.api_key = api_key;
    this.temperature = temperature;
    this.candidateCount = candidateCount;
  }

  async call(prompt) {
    const client = new DiscussServiceClient({
      authClient: new GoogleAuth().fromAPIKey(this.api_key),
    });

    return client.generateMessage({
      model: this.model,
      temperature: this.temperature,
      candidateCount: this.candidateCount,
      prompt,
    });
  }
}

async function main() {
  dotenv.config();
  const chat = new Chat({
    model: MODEL_NAME,
    api_key: process.env.API_KEY,
  });
  const result = await chat.call({
    context: "Respond to all questions with a rhyming poem.",
    examples: [
      {
        input: { content: "What is the capital of California?" },
        output: {
          content: `If the capital of California is what you seek,
Sacramento is where you ought to peek.`,
        },
      },
    ],
    messages: [{ content: "How tall is the Eiffel Tower?" }],
  });

  console.log(result[0].candidates[0].content);
}

main();
