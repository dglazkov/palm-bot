import { Chat } from "./palm.js";
import { questionAnswerCommand } from "./commands.js";
import { config } from "dotenv";

import { Client, Events, GatewayIntentBits } from "discord.js";

const MODEL_NAME = "models/chat-bison-001";

// Where the magic happens.
async function main() {
  // Load `.env` file.
  config();

  // Create a Discord.js client.
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  // Create a new PaLM chat instance.
  const chat = new Chat({
    model: MODEL_NAME,
    api_key: process.env.API_KEY,
  });

  // When the client is ready, log a message to the console.
  client.once(Events.ClientReady, () => {
    console.log("Ready!");
  });

  // Register a command handler for the `/poet` command.
  // Since there's only one command in this bot, there's no logic to
  // distinguish between different commands.
  client.on(
    Events.InteractionCreate,
    questionAnswerCommand(async ({ question, user }) => {
      // Call the PaLM chat API.
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
