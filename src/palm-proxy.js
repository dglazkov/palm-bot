import axios from "axios";

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
    return axios.post("https://palmerproxy.herokuapp.com/generatePalm", {
      model: this.model,
      temperature: this.temperature,
      candidateCount: this.candidateCount,
      prompt,
    });
  }
}
