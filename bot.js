process.env.NTBA_FIX_319 = 1;
const fs = require("fs");
const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();
const schedule = require("node-schedule");
const sheets = require("./sheets");
const Twit = require("twit");

const TwitClient = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: false, // optional - requires SSL certificates to be valid.
});

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

const LASTINDEXFILE = "lastIndex.txt";

function getRows(callback) {
  sheets.spreadsheets.values.get(
    {
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "A:A",
    },
    (err, res) => {
      if (err) return console.log(err);
      callback(res.data.values);
    }
  );
}

console.log("Bot has started");
let index;
if (
  process.argv.length > 2 &&
  process.argv[2].toLocaleLowerCase() == "--start"
) {
  index = 0;
} else {
  try {
    index = parseInt(fs.readFileSync(LASTINDEXFILE, "utf8"), 10);
  } catch (e) {
    index = 0;
  }
}

schedule.scheduleJob("0 * * * *", () => getRows(main));

function main(phrases) {
  if (index >= phrases.length) index = index % phrases.length;
  console.log(`[${new Date().toLocaleString()}] ${phrases[index][0]}`);
  bot.sendMessage(CHAT_ID, phrases[index][0]);
  TwitClient.post(
    "statuses/update",
    { status: phrases[index][0] },
    function (err, data, response) {
      if (err) {
        console.log("Twitter Error!");
        console.log(err);
        return;
      }
    }
  );
  index++;
  try {
    fs.writeFileSync(LASTINDEXFILE, `${index}`);
  } catch (e) {
    console.log("Error: Couldn't write to " + LASTINDEXFILE);
  }
}
