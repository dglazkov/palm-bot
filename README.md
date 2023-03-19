# The simplest possible Discord bot using PaLM APIs

Okay, maybe not the simplest, but it's a good starting point.

## Setup

This setup assumes that you know how to set up a node environment and clone this repository to your local machine.

1. Install dependencies

```bash
npm install
```

2. Get your PaLM API key, following instructions on MakerSuite.

3. Follow [wonderful instructions](https://discordjs.guide/preparations/setting-up-a-bot-application.html) on discord.js to set up a bot and get your Discord token and [application id](https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands).

4. Create a `.env` file in the root of this project and add your API keys and Discord tokens to it, like so:

```bash
API_KEY="your-palm-api-key"
DISCORD_TOKEN="your-discord-token"
APPLICATION_ID="your-discord-application-id"
```

5. Register commands with Discord

```bash
node src/register.js
```

6. Run the bot

```bash
node .
```

## Code structure

The code that comprises the bot sits in `./src`. Tests are in `./tests`.

The main entry point is `./src/index.js`.

Each file is documented well enough to figure it out what it does.
