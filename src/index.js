import { Chat } from "./palm.js";
import { questionAnswerCommand } from "./commands.js";
import * as dotenv from "dotenv";

import { Client, Events, GatewayIntentBits, EmbedBuilder } from "discord.js";

const MODEL_NAME = "models/chat-bison-001";

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

  client.on(
    Events.InteractionCreate,
    questionAnswerCommand(async ({ question, user }) => {
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
      const reply = result[0].candidates[0].content;

      return `**A poem for ${user}**\n${reply}`;
    })
  );

  client.login(process.env.DISCORD_TOKEN);
}

main();
