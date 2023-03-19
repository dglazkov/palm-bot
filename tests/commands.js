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
    reply: async (message) => {
      t.is(message, "Question: **question**");
    },
    channel: {
      sendTyping: async () => {},
    },
    followUp: async ({ content, ephemeral }) => {
      t.is(content, "An error has occurred:\n```error```");
      t.true(ephemeral);
    },
  };

  await handler(interaction);
});

test("questionAnswerCommand handles long messages", async (t) => {
  const handler = questionAnswerCommand(async ({ question, user }) => {
    return "a".repeat(2001);
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
      t.is(message.length, 2000);
      t.true(message.endsWith(" *(truncated)*"));
    },
  };

  await handler(interaction);
});
