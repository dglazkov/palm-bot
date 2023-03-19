import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { config } from "dotenv";

config();

const appId = process.env.APPLICATION_ID;
const token = process.env.DISCORD_TOKEN;

// The logic below is adapted from the Discord.js documentation:
// https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands

// Construct the `/poet` command.
const command = new SlashCommandBuilder()
  .setName("poet")
  .setDescription("Responds to all questions with a rhyming poem")
  .addStringOption((option) =>
    option
      .setName("question")
      .setDescription("The question to answer poetically")
      .setRequired(true)
  );

const commands = [command.toJSON()];

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
