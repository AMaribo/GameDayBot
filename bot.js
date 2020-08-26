const Discord = require('discord.js');
const fs = require('fs');
const { prefix, token } = require('./config.json');

// Initialize Discord Bot
var bot = new Discord.Client();

bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

bot.once('ready', () => {
    console.log('Ready!');
})

bot.on('message', message => {

    //Some commands have message strings instead of commands.
    if (message.author.bot) return;

    const msg = message.content;
    const channel = message.channel;
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
    var match = msg.match(/(be|is) it (?<day>mon|tues|wednes|thurs|fri|satur|sun)day/i);
    var match2 = msg.match(/when (be it|will it be) (?<day>mon|tues|wednes|thurs|fri|satur|sun)day/i);
    if (match2) {
        var msgDay = match2.groups["day"] + "day";
        var cmd = msgDay[0].toUpperCase() + msgDay.substring(1).toLowerCase();
        var isDay = weekday.indexOf(cmd);
        var numDay = isDay - d.getDay();
        if (numDay < 0) {
            numDay += 7;
        }
        if (numDay === 0) {
            channel.send("It's " + cmd + " today! :thumbsup:");
        } else if (numDay === 1) {
            channel.send("It'll be " + cmd + " in " + numDay + " day... :slight_smile:");
        } else {
            channel.send("It'll be " + cmd + " in " + numDay + " days... :cry:");
        }
    }
    else if (match) {
        var msgDay = match.groups["day"] + "day";
        var cmd = msgDay[0].toUpperCase() + msgDay.substring(1).toLowerCase();

        if (day === cmd) {
            channel.send("Yes! It's " + cmd + " today! :thumbsup:");
        } else {
            channel.send("No! It's only " + day + " today. :frowning:");
        }
    }
    else if (msg.substring(0,1) == '!') {
        var args = msg.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            // !help
            case 'help':
            channel.send("The two commands are as follows:\n```\nis it ___day\nwhen will it be ___day\n```");
        }
    }
});

bot.login(token);