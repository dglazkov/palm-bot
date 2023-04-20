import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { config } from "dotenv";

config();

const appId = process.env.APPLICATION_ID;
const token = process.env.DISCORD_TOKEN;

// The logic below is adapted from the Discord.js documentation:
// https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands

// Construct the `/poet` command.
const poet = new SlashCommandBuilder()
  .setName("poet")
  .setDescription("Responds to all questions with a rhyming poem")
  .addStringOption((option) =>
    option
      .setName("question")
      .setDescription("The question to answer poetically")
      .setRequired(true)
  );

// Construct the `/joke` command.
const joke = new SlashCommandBuilder()
  .setName("joke")
  .setDescription("Responds to all questions with a joke")
  .addStringOption((option) =>
    option
      .setName("question")
      .setDescription("The question to answer")
      .setRequired(true)
  );

// Construct the `/child` command.
const child = new SlashCommandBuilder()
  .setName("child")
  .setDescription("Responds to all questions like a 5-year old child")
  .addStringOption((option) =>
    option
      .setName("question")
      .setDescription("The question to answer")
      .setRequired(true)
  );

// Construct the `/code` command.
const code = new SlashCommandBuilder()
  .setName("code")
  .setDescription("Responds to all questions with a code snippet")
  .addStringOption((option) =>
    option
      .setName("question")
      .setDescription("The question to answer with code")
      .setRequired(true)
  );

// Construct the `/chat` command.
const chat = new SlashCommandBuilder()
  .setName("chat")
  .setDescription("Chat with Palmer, the AI chatbot.")
  .addStringOption((option) =>
    option
      .setName("prompt")
      .setDescription("The prompt for the chatbot")
      .setRequired(true)
  );

const commands = [
  poet.toJSON(),
  code.toJSON(),
  joke.toJSON(),
  child.toJSON(),
  chat.toJSON(),
];

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(token);

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(Routes.applicationCommands(appId), {
      body: commands,
    });

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
