const Discord = require('discord.io');
const fs = require('fs');
const logger = require('winston');
const { prefix, token } = require('./config.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
   token: token,
   autorun: true
});

bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {

    //Some commands have message strings instead of commands.
    if (message.author.bot) return;

    var d = new Date();
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    var day = weekday[d.getDay()];

    // Our bot needs to know if it will execute a command
    // It will listen for messages that inslude the text `is it ___day`
    var match = message.search(/is it (mon|tues|wednes|thurs|fri|satur|sun)day/i);
    var match2 = message.search(/when will it be (mon|tues|wednes|thurs|fri|satur|sun)day/i);
    if (match >= 0) {
        var args = message.substring(match+6).split(' ');
        var cmd = args[0].toLowerCase().replace(/\W/g,"");
        cmd = cmd[0].toUpperCase() + cmd.substring(1);

        if (day === cmd) {
            bot.sendMessage({
                to: channelID,
                message: "Yes! It's " + cmd + " today! :thumbsup:"
            });
        } else {
            bot.sendMessage({
                to: channelID,
                message: "No! It's only " + day + " today. :frowning:"
            });
        }
    }
    if (match2 >= 0) {
        var args = message.substring(match2+16).split(' ');
        var cmd = args[0].toLowerCase().replace(/\W/g,"");
        cmd = cmd[0].toUpperCase() + cmd.substring(1);
        var isDay = weekday.indexOf(cmd);
        var numDay = isDay - d.getDay();
        if (numDay < 0) {
            numDay += 7;
        }
        if (numDay === 0) {
            bot.sendMessage({
                to: channelID,
                message: "It's " + cmd + " today! :thumbsup:"
            });
        } else if (numDay === 1) {
            bot.sendMessage({
                to: channelID,
                message: "It'll be " + cmd + " in " + numDay + " day... :slight_smile:"
            });
        } else {
            bot.sendMessage({
                to: channelID,
                message: "It'll be " + cmd + " in " + numDay + " days... :cry:"
            });
        }
    }
    if (message.substring(0,1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            // !help
            case 'help':
            bot.sendMessage({
                to: channelID,
                message: "The two commands are as follows:\n```\nis it ___day\nwhen will it be ___day\n```"
            })
        }
    }
});