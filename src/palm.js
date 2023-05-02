import { DiscussServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";

// A simple wrapper around the PaLM `DiscussServiceClient`.
export class Chat {
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
