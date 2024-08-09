const TelegramBot = require("node-telegram-bot-api");
const token = "YOUR_BOT_TOKEN";
const bot = new TelegramBot(token, { polling: true });

const players = {};

function createBotPlayer() {
  return {
    health: 100,
    coins: Math.floor(Math.random() * 50) + 10,
    lastAction: 0,
    isBot: true,
  };
}

for (let i = 0; i < 5; i++) {
  players[`bot${i}`] = createBotPlayer();
}

bot.setMyCommands([
  { command: "/start", description: "Start the game" },
  { command: "/help", description: "Show available commands" },
  { command: "/status", description: "Check status" },
  { command: "/mine", description: "Mine coins" },
  { command: "/attack", description: "Attack a random player" },
]);

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();

  if (!players[userId] || players[userId].health <= 0) {
    players[userId] = {
      health: 100,
      coins: 0,
      lastAction: 0,
      isBot: false,
    };
    bot.sendMessage(
      chatId,
      "Welcome to the game! Use the command menu or /help to see available actions."
    );
  } else {
    bot.sendMessage(
      chatId,
      "You are already in the game. Use /status to check your status."
    );
  }
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Available commands:\n/start - Start the game\n/status - Check status\n/mine - Mine coins\n/attack - Attack a random player"
  );
});

bot.onText(/\/status/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();

  if (players[userId]) {
    bot.sendMessage(
      chatId,
      `Your status:\nHealth: ${players[userId].health}\nCoins: ${players[userId].coins}`
    );
  } else {
    bot.sendMessage(chatId, "Please start the game with /start first.");
  }
});

bot.onText(/\/mine/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();

  if (players[userId] && players[userId].health > 0) {
    const now = Date.now();
    if (now - players[userId].lastAction > 5000) {
      const coinsEarned = Math.floor(Math.random() * 10) + 1;
      players[userId].coins += coinsEarned;
      players[userId].lastAction = now;
      bot.sendMessage(
        chatId,
        `You mined ${coinsEarned} coins! You now have ${players[userId].coins} coins.`
      );
    } else {
      bot.sendMessage(chatId, "Please wait 5 seconds before your next action.");
    }
  } else {
    bot.sendMessage(chatId, "Please start the game with /start first.");
  }
});

bot.onText(/\/attack/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();

  if (players[userId] && players[userId].health > 0) {
    const now = Date.now();
    if (now - players[userId].lastAction > 5000) {
      const targetIds = Object.keys(players).filter(
        (id) => id !== userId && players[id].health > 0
      );
      if (targetIds.length > 0) {
        const targetId =
          targetIds[Math.floor(Math.random() * targetIds.length)];
        const damage = Math.floor(Math.random() * 20) + 1;
        const counterDamage = Math.floor(Math.random() * 15) + 1;
        const coinsEarned = Math.floor(Math.random() * 5) + 1;

        players[targetId].health -= damage;
        players[userId].health -= counterDamage;
        players[userId].coins += coinsEarned;
        players[userId].lastAction = now;

        let message = `You attacked ${
          players[targetId].isBot ? "a bot" : "a player"
        } and dealt ${damage} damage!\n`;
        message += `You received ${counterDamage} damage in return.\n`;
        message += `You earned ${coinsEarned} coins for the attack.\n`;
        message += `The target has ${
          players[targetId].health > 0 ? players[targetId].health : 0
        } health left.\n`;

        if (players[targetId].health <= 0) {
          const coinsStolen = players[targetId].coins;
          players[userId].coins += coinsStolen;
          message += `You defeated the opponent and stole an additional ${coinsStolen} coins!\n`;

          if (players[targetId].isBot) {
            players[targetId] = createBotPlayer();
          } else {
            delete players[targetId];
          }
        }

        if (players[userId].health <= 0) {
          message += `Your health has reached 0. Game over!\n`;
          message += `Final score: ${players[userId].coins} coins.\n`;
          message += `Use /start to begin a new game.`;
          delete players[userId];
        } else {
          message += `Your status:\nHealth: ${players[userId].health}\nCoins: ${players[userId].coins}`;
        }

        bot.sendMessage(chatId, message);
      } else {
        bot.sendMessage(
          chatId,
          "No available players to attack. Try again later."
        );
      }
    } else {
      bot.sendMessage(chatId, "Please wait 5 seconds before your next action.");
    }
  } else {
    bot.sendMessage(chatId, "Please start the game with /start first.");
  }
});

console.log("Bot is starting...");

bot.on("polling_error", (error) => {
  console.log("Polling error:", error);
});
