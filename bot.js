const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const sheets = require('./sheets');

// replace the value below with the Telegram token you receive from @BotFather
const token = '1851135512:AAGtMvlMHXEKpNFd_0GnrvM6H1hkpTtBS_c';
const CHAT_ID = "-1001598728604";

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

let index = 0;
getRows(main);
setInterval(() => {index++; getRows(main)}, 1000 * 60 * 60)

function main(phrases) {
    bot.sendMessage(CHAT_ID, phrases[index % phrases.length][0])
}