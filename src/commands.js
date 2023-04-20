// Discord's messages have a maximum length of 2000 characters.
const MAX_MESSAGE_LENGTH = 2000;

// Trim a message to the maximum allowed length, and append a
// message indicating that the string was truncated.
const trim = (str) => {
  if (str.length < MAX_MESSAGE_LENGTH) {
    return str;
  }
  const truncated = " *(truncated)*";
  return `${str.substring(
    0,
    MAX_MESSAGE_LENGTH - truncated.length
  )}${truncated}`;
};

// Captures the logic for handling a typical question-answer command.
// This function returns a function that can be passed to Discord.js's
// `client.on` method.
// Arguments:
//   handler: A function that takes an object with the following two properties:
//   - question -- The question that the user asked (string).
//   - user -- The Discord.js object representing user who asked the question.

export const questionAnswerCommand = (handler, commandName) => {
  return async (interaction) => {
    if (
      !interaction.isChatInputCommand() ||
      interaction.commandName !== commandName
    )
      return;
    const question = interaction.options.getString("question");
    try {
      await interaction.reply(`Question: **${question}**`);
      await interaction.channel.sendTyping();
      const user = interaction.user;
      const reply = await handler({ question, user });
      await interaction.followUp(trim(reply));
    } catch (error) {
      await interaction.followUp({
        content: `An error has occurred:\n\`\`\`${error.message}\`\`\``,
        ephemeral: true,
      });
    }
  };
};

export const questionAnswerInThreadCommand = (handler, commandName) => {
  return async (interaction) => {
    if (
      !interaction.isChatInputCommand() ||
      interaction.commandName !== commandName
    )
      return;
    const prompt = interaction.options.getString("prompt");
    try {
      await interaction.reply(`Prompt: **${prompt}**`);

      // Create a new thread in the channel where the command was used
      const thread = await interaction.channel.threads.create({
        name: `Thread for ${commandName} command`,
        autoArchiveDuration: 1440, // 24 hours
      });

      // Get the latest 5 messages in the thread
      const messages = await thread.messages.fetch({ limit: 5 });
      const mappedMessages = messages.map((message) => ({ content: message }));
      console.log({ mappedMessages });
      // Pass the messages and other relevant information to the handler function
      const context = { prompt, messages: mappedMessages };
      const reply = await handler(context);

      // Post the reply in the thread
      await thread.send(trim(reply));
    } catch (error) {
      await interaction.followUp({
        content: `An error has occurred:\n\`\`\`${error.message}\`\`\``,
        ephemeral: true,
      });
    }
  };
};
