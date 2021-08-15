const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const db = require('quick.db');
const { stripIndents } = require("common-tags");
const { cyan } = require("../../JSON/colours.json");
const { PREFIX } = require('../../config');

module.exports = {
    config: {
        name: "help",
        aliases: ["h"],
        usage: "[command name] (optional)",
        category: "info",
        description: "Displays all commands that the bot has.",
        accessableby: "everyone"
    },
    run: async (bot, message, args) => {
        let prefix;
        let fetched = await db.fetch(`prefix_${message.guild.id}`);

        if (fetched === null) {
            prefix = PREFIX
        } else {
            prefix = fetched
        }

        const embed = new MessageEmbed()
            .setColor(cyan)
            .setAuthor(`${message.guild.me.displayName} Help`, message.guild.iconURL())
            .setThumbnail(bot.user.displayAvatarURL())

        if (!args[0]) {

            const sembed = new MessageEmbed()
                .setImage("https://media.discordapp.net/attachments/863200886782951476/871670392979357726/DM.jpg?width=1202&height=676")
                .setAuthor(`${message.guild.me.displayName}`, message.guild.iconURL())
                .setColor("GREEN")
                .setDescription('**Un message vous a été envoyé en DMs!**')
            message.channel.send(sembed).then(msg => {
                msg.delete({ timeout: 10000 });
            })

            const categories = readdirSync("./commands/")
        	embed.addFields(
        		{ name: 'Support', value: 'Site , Invite' },
        		{ name: '\u200B', value: '\u200B' },
        		{ name: 'Site Web', value: 'https://natexweb.glitch.me/index.html', inline: true },
        		{ name: 'Bot Invite', value: 'https://bit.ly/invitenatex', inline: true },
        	)
            embed.setImage("https://media.discordapp.net/attachments/863200886782951476/871670669006499880/HELP.jpg?width=1202&height=676")
            embed.setDescription(`**Voici les commandes disponibles pour ${message.guild.me.displayName}\nBot's Global Prefix Is \`${PREFIX}\`\nServeur Prefix c'est \`${prefix}\`\n\nPour l'aide relative à un type de commande particulier -\n\`${prefix}help [command name | alias]\`**`)
            embed.setFooter(`${message.guild.me.displayName} | Total Commands - ${bot.commands.size - 1} https://natexweb.glitch.me | https://discord.gg/4kTehZuEU6 | n!owner`, bot.user.displayAvatarURL());
            embed.setColor('#FFFFFF')

            categories.forEach(category => {
                const dir = bot.commands.filter(c => c.config.category === category)
                const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1)
                try {
                    embed.addField(` ${capitalise} [${dir.size}] - `, dir.map(c => `\`${c.config.name}\``).join(" "))
                } catch (e) {
                    console.log(e)
                }
            })

            return message.author.send(embed)
        } else {
            let command = bot.commands.get(bot.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase())
            if (!command) return message.channel.send(embed.setTitle("**Invalid Command!**").setDescription(`**Do \`${prefix}help\` For the List Of the Commands!**`))
            command = command.config

            embed.setDescription(stripIndents`**The Bot's Global Prefix Is \`${PREFIX}\`**\n
            **Server Prefix Is \`${prefix}\`**\n
            ** Command -** ${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}\n
            ** Description -** ${command.description || "No Description provided."}\n
            **Category -** ${command.category}\n
            ** Usage -** ${command.usage ? `\`${prefix}${command.name} ${command.usage}\`` : "No Usage"}\n
            ** Accessible by -** ${command.accessableby || "everyone"}\n
            ** Aliases -** ${command.aliases ? command.aliases.join(", ") : "None."}`)
            embed.setFooter(message.guild.name, message.guild.iconURL())

            return message.channel.send(embed)
        }
    }
};