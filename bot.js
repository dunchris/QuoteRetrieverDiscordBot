var Discord = require('discord.io');
var logger = require('winston');
var scraper = require('./scraper/pl-scraper.js');
require('dotenv').config()
const quote_url = "https://www.wow4u.com/quote-of-the-day/";
// Configure logger settings

console.log(scraper);

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: process.env.BOT_TOKEN,
   autorun: true
});



bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username);
});
bot.on('message', async function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            
            case 'quote':
                scraper.quote_today(quote_url, function (quote) {
                    bot.sendMessage({
                        to: channelID,
                        message: quote
                    });
                })
                
            break;
            // Just add any case commands if you want to..
         }
     }
});

