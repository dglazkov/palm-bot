import { Chat } from "./palm.js";
import * as dotenv from "dotenv";

import { Client, Events, GatewayIntentBits, EmbedBuilder } from "discord.js";

const MODEL_NAME = "models/chat-bison-001";
const MAX_MESSAGE_LENGTH = 2000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const trim = (str) => {
  if (str.length < MAX_MESSAGE_LENGTH) {
    return str;
  }
  const truncated = " (truncated)";
  return `${str.substring(
    0,
    MAX_MESSAGE_LENGTH - truncated.length
  )}{truncated}`;
};

const questionAnswerCommand = (handler) => {
  return async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const question = interaction.options.getString("question");
    try {
      await interaction.reply(`Question: **${question}**`);
      await interaction.channel.sendTyping();
      const user = interaction.user;
      const reply = await handler({ question, user });
      await interaction.followUp(reply);
    } catch (error) {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command.",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command.",
          ephemeral: true,
        });
      }
    }
  };
};

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
