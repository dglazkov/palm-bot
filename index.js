import { DiscussServiceClient } from "@google-cloud/generativelanguage";
import { GoogleAuth } from "google-auth-library";
import * as dotenv from "dotenv";

import { Client, Events, GatewayIntentBits } from "discord.js";

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

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  dotenv.config();

  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  const chat = new Chat({
    model: MODEL_NAME,
    api_key: process.env.API_KEY,
  });

  client.once(Events.ClientReady, () => {
    console.log("Ready!");
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const question = interaction.options.getString("question");
    try {
      await interaction.deferReply();
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
        messages: [{ content: question }],
      });
      await interaction.editReply(
        `**${question}**\n${result[0].candidates[0].content}`
      );
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  });

  client.login(process.env.DISCORD_TOKEN);
}

main();
