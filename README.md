Telegram Game Bot
This is a simple Telegram bot game where players can mine coins, attack other players, and see their status. The bot also includes some AI-controlled bot players.

Features
Start a game session
Check your player's status
Mine coins with a cooldown period
Attack random players or bots
Earn coins and defeat opponents
Getting Started
Prerequisites
To run this bot, you'll need:

Node.js installed on your machine.
A Telegram bot token, which you can get by creating a bot with BotFather.
Installation
Clone the repository:

bash
Копировать код
git clone https://github.com/yourusername/telegram-game-bot.git
cd telegram-game-bot
Install dependencies:

bash
Копировать код
npm install
Configure the bot token:

Replace YOUR_BOT_TOKEN in the code with your actual Telegram bot token.

javascript
Копировать код
const token = 'YOUR_BOT_TOKEN';
Running the Bot
Once you have installed the dependencies and set the token:

bash
Копировать код
node index.js
This will start the bot, and it will be ready to interact with users.

Commands
/start - Start the game and create a new player.
/help - Show a list of available commands.
/status - Check your current health and coins.
/mine - Mine random coins (with a 5-second cooldown).
/attack - Attack a random player or bot (with a 5-second cooldown).
Handling Polling Errors
If you encounter any polling errors, they will be logged in the console. The bot is configured to handle these errors and will continue running.

Contributing
If you'd like to contribute to this project, feel free to open an issue or submit a pull request.
