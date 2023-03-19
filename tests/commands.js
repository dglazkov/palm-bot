import test from "ava";

import { questionAnswerCommand } from "../src/commands.js";

test("questionAnswerCommand returns results", async (t) => {
  const handler = questionAnswerCommand(async ({ question, user }) => {
    return `${user}:${question}`;
  });

  const interaction = {
    isChatInputCommand: () => true,
    options: {
      getString: () => "question",
    },
    user: "user",
    reply: async (message) => {
      t.is(message, "Question: **question**");
    },
    channel: {
      sendTyping: async () => {},
    },
    followUp: async (message) => {
      t.is(message, "user:question");
    },
  };

  await handler(interaction);
});

test("questionAnswerCommand handles errors", async (t) => {
  const handler = questionAnswerCommand(async ({ question, user }) => {
    throw new Error("error");
  });

  const interaction = {
    isChatInputCommand: () => true,
    options: {
      getString: () => "question",
    },
    user: "user",
    replied: true,
    followUp: async ({ content, ephemeral }) => {
      t.is(content, "There was an error while executing this command.");
      t.true(ephemeral);
    },
  };

  await handler(interaction);
});
