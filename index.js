const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
require('dotenv').config();
const express = require('express');

const createBotClient = () => {
  return new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
    ],
  });
};

const botTokens = [
  process.env.TOKEN1,
  process.env.TOKEN2,
  process.env.TOKEN3,
  process.env.TOKEN4,
  process.env.TOKEN5,
];

let currentIndex = 0;

const validTokens = botTokens.filter(token => token);
const clients = validTokens.map(createBotClient);

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Bot Status changed Sucessfully!');
});

app.listen(port, () => {
  console.log(`\x1b[36m%s\x1b[0m`, `|  💮 Listening to GlaceYT: http://localhost:${port}`);
  console.log(`\x1b[36m%s\x1b[0m`, `|  ⭕ Powered By GlaceYT`);
});

const updateStatus = (client) => {
  client.user.setPresence({
    activities: [{ name: 'Listening to Malteser daddy', type: ActivityType.Custom }],
    status: 'dnd',
  });
};

const loginBots = async () => {
  try {
    await Promise.all(clients.map((client, index) => {
      return new Promise(async (resolve, reject) => {
        client.once('ready', () => {
          console.log(`\x1b[36m%s\x1b[0m`, `|    ✅ Bot ${index + 1} is ready as ${client.user.tag}`);
          updateStatus(client);
          resolve();
        });

        try {
          await client.login(validTokens[index]);
          console.log(`\x1b[36m%s\x1b[0m`, `|    🐇 Bot ${index + 1} logged in as ${client.user.tag}`);
        } catch (error) {
          console.error(`Failed to log in Bot ${index + 1}:`, error);
          reject(error);
        }
      });
    }));

    setInterval(() => {
      currentIndex = (currentIndex + 1) % 1;  
      clients.forEach(updateStatus);
    }, 10000);

  } catch (error) {
    console.error('Failed to login', error);
    process.exit(1);
  }
};

loginBots();
