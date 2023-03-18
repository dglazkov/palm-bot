import { DiscussServiceClient } from "@google-cloud/generativelanguage";
import { GoogleAuth } from "google-auth-library";
import * as dotenv from "dotenv";

dotenv.config();

const MODEL_NAME = "models/chat-bison-001";
const API_KEY = process.env.API_KEY;

const client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

async function main() {
  const result = await client.generateMessage({
    model: MODEL_NAME, // required, which model to use to generate the result
    temperature: 0.5, // optional, 0.0 always uses the highest-probability deastresult
    candidateCount: 1, // optional, how many candidate results to generate
    prompt: {
      // optional, preamble context to prime responses
      context: "Respond to all questions with a rhyming poem.",
      // optional, examples to further finetune responses
      examples: [
        {
          input: { content: "What is the capital of California?" },
          output: {
            content: `If the capital of California is what you seek,
Sacramento is where you ought to peek.`,
          },
        },
      ],
      // required, alternating prompt/response messages
      messages: [{ content: "How tall is the Eiffel Tower?" }],
    },
  });

  console.log(result[0].candidates[0].content);
}

main();
