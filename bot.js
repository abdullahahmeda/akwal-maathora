const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const sheets = require('./sheets');

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

function getRows(callback) {
    sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: 'A:A',
    }, (err, res) => {
        if (err) return console.log(err);
        callback(res.data.values)
    })
}

let index = 7113;
getRows(main);
setInterval(() => {index++; getRows(main)}, 1000 * 60 * 60)

function main(phrases) {
    if (index >= phrases.length) index = index % phrases.length;
    bot.sendMessage(CHAT_ID, phrases[index][0])
}