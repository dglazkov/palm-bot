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
export const questionAnswerCommand = (handler) => {
  return async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
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
