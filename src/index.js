import { Chat } from "./palm.js";
import {
  questionAnswerCommand,
  questionAnswerInThreadCommand,
} from "./commands.js";
import { config } from "dotenv";

import { Client, Events, GatewayIntentBits } from "discord.js";

const MODEL_NAME = "models/chat-bison-001";
const HISTORY_SIZE = 5;
// Where the magic happens.
async function main() {
  // Load `.env` file.
  config();

  // Create a Discord.js client.
  const { Guilds, GuildMessages } = GatewayIntentBits;
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  });

  // Create a new PaLM chat instance.
  const chat = new Chat({
    model: MODEL_NAME,
    api_key: process.env.API_KEY,
  });

  // When the client is ready, log a message to the console.
  client.once(Events.ClientReady, () => {
    console.log("Ready!");
  });

  // Register a command handler for the "joke"-command.
  client.on(
    Events.InteractionCreate,
    questionAnswerCommand(async ({ question, user }) => {
      const result = await chat.call({
        context: "Respond to all questions with a joke.",
        examples: [
          {
            input: {
              content:
                "Answer this with a joke: Can you provide me with a pizza-recipe?",
            },
            output: {
              content: `Sure, here's your pizza-recipe:

                 Ingredients:

                  1 cardboard box
                  1 marker
                  1 imagination
                  Instructions:

                  Take the cardboard box and draw a circle on it with the marker.
                  Imagine that the circle is a delicious pizza crust.
                  Use your imagination to add your favorite pizza toppings to the "crust".
                  Pretend to cook the pizza in an imaginary oven until it's perfectly imaginary crispy.
                  Enjoy your imaginary pizza with imaginary friends.`,
            },
          },
          {
            input: {
              content: "Answer this with a joke: What's the capitol of Sweden?",
            },
            output: {
              content: `The capitol of Sweden is IKEA.`,
            },
          },
          {
            input: {
              content:
                "Answer this with a joke: What's the best way to get a job?",
            },
            output: {
              content: `Well, the best way to get a job is to simply buy a company and then hire yourself!`,
            },
          },
        ],
        messages: [{ content: "Answer this with a joke: " + question }],
      });

      const reply = result[0].candidates[0].content;

      return `${reply}`;
    }, "joke")
  );
  // Register a command handler for the "child"-command.
  client.on(
    Events.InteractionCreate,
    questionAnswerCommand(async ({ question, user }) => {
      const result = await chat.call({
        context:
          "You're a 5 year old child. Respond to all questions as if you're a overly excited child.",
        examples: [
          {
            input: {
              content: "Answer this as a child: Why are tomatoes red?",
            },
            output: {
              content: `Ooh, I know this one! Tomatoes are red because they love to sunbathe all day long! Just like how our skin turns red when we spend too much time in the sun, tomatoes turn red when they're in the sun. So when you see a red tomato, you know it's been having a really good time in the sun!`,
            },
          },
          {
            input: {
              content:
                "Answer this as a child: What's the second law of motion?",
            },
            output: {
              content: `I don't know. I'm not a scientist! What makes a car go vroom vroom?`,
            },
          },
          {},
        ],
        messages: [{ content: "Answer this as a child: " + question }],
      });

      const reply = result[0].candidates[0].content;

      return `${reply}`;
    }, "child")
  );

  // Register a command handler for the "code"-command.
  client.on(
    Events.InteractionCreate,
    questionAnswerCommand(async ({ question, user }) => {
      const result = await chat.call({
        context:
          "Respond to all questions with a code snippet. If the question is not about code, respond with a funny code snippet.",
        examples: [
          {
            input: {
              content:
                "Answer this as a code snippet: Can you create a React button that updates a redux state for light or dark theme when pressed. Please also provide a nice css styling.",
            },
            output: {
              content: `Sure, here's a simple example:

                  1. Create a redux action:
                  // actions.js
                  export const toggleTheme = () => ({
                    type: "TOGGLE_THEME",
                  });


                  2. Create a reducer:
                  // reducer.js
                  const initialState = {
                    theme: "light",
                  };

                  export const themeReducer = (state = initialState, action) => {
                    switch (action.type) {
                      case "TOGGLE_THEME":
                        return { ...state, theme: state.theme === "light" ? "dark" : "light" };
                      default:
                        return state;
                    }
                  };


                  3. Create a React component:
                  // ThemeButton.js
                  import React from "react";
                  import { useDispatch, useSelector } from "react-redux";
                  import { toggleTheme } from "./actions";

                  const ThemeButton = () => {
                    const dispatch = useDispatch();
                    const theme = useSelector((state) => state.theme);

                    const handleClick = () => {
                      dispatch(toggleTheme());
                    };

                    return (
                      <button
                        onClick={handleClick}
                        style={{
                          backgroundColor: theme === "light" ? "#fff" : "#333",
                          color: theme === "light" ? "#333" : "#fff",
                          borderRadius: "5px",
                          padding: "10px",
                        }}
                      >
                        Toggle Theme
                      </button>
                    );
                  };

                  export default ThemeButton;


                  4. add the reducer to your store and use the ThemeButton component in your app. don't forget to import the necessary redux and react-redux packages!`,
            },
          },
          {
            input: {
              content:
                "Answer this as a code snippet: Can you create a React button?",
            },
            output: {
              content: `
                <button
                  onClick={handleClick}
                >
                  Button Text
                </button>`,
            },
          },
          {
            input: { content: "What are you up to?" },
            output: {
              content: `if activity == "discord":
                              print("I'm currently chatting with people in discord!")
                          else:
                              print("Probably napping...")`,
            },
          },
        ],
        messages: [{ content: "Answer this as a code snippet: " + question }],
      });

      const reply = result[0].candidates[0].content;

      return `**A code snippet for ${user}**\n${reply}`;
    }, "code")
  );

  // Register a command handler for the "poet"-command.
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
          {
            input: { content: "How are you?" },
            output: {
              content: `I am doing well, I must say,
I'm happy and healthy, in every way.
I'm excited to help you with your tasks,
And I'm always learning, I never lack.`,
            },
          },
        ],
        messages: [{ content: "Answer this as a rhyming poem: " + question }],
      });

      const reply = result[0].candidates[0].content;

      return `**A poem for ${user}**\n${reply}`;
    }, "poet")
  );

  // Register a command handler for the "chat"-command.
  client.on(
    Events.InteractionCreate,
    questionAnswerInThreadCommand(async ({ prompt, messages }) => {
      const result = await chat.call({
        context:
          "You are a person. You write mostly with lower-case letters and use lots of emojis and abbreviations.",
        examples: [
          {
            input: { content: "Hi! How are you?" },
            output: {
              content: `Hi! :) I'm good, hbu?.`,
            },
          },
          {
            input: { content: "What are you doing today?" },
            output: {
              content: `Not much. Talking to people in discord. Might go for a walk later. :person_running: You?`,
            },
          },
        ],
        messages: [{ content: prompt }],
      });

      const reply = result[0].candidates[0].content;

      return `${reply}`;
    }, "chat")
  );

  // Register a messageCreate handler, which looks at all new messages. If it is in the same thread as a message sent by the bot, it will parse the question and pass it to the handler.
  client.on(Events.MessageCreate, async (message) => {
    const channel = client.channels.cache.get(message.channelId);
    if (!channel.isThread() || message.author.bot) {
      return;
    } else {
      // Get history
      const messages = await channel.messages.fetch({ limit: HISTORY_SIZE });

      const content = messages
        .map((message) => {
          return { content: message.content };
        })
        .reverse();

      const result = await chat.call({
        context:
          "You are a person. You write mostly with lower-case letters and use lots of emojis and abbreviations.",
        examples: [
          {
            input: { content: "Hi! How are you?" },
            output: {
              content: `Hi! :) I'm good, hbu?.`,
            },
          },
          {
            input: { content: "What are you doing today?" },
            output: {
              content: `Not much. Talking to people in discord. Might go for a walk later. :person_running: You?`,
            },
          },
        ],
        messages: content,
      });

      const reply = result[0].candidates[0].content;

      await channel.send(reply);
    }
  });

  client.login(process.env.DISCORD_TOKEN);
}

main();
