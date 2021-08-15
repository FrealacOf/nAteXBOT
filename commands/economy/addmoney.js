const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
    config: {
        name: "addmoney",
        aliases: ["am"],
        category: "economy",
        description: "Adds Money to a user",
        usage: "[ mention | ID]",
        accessableby: "Administrator, Owner"
    },
    run: async (bot, message, args) => {
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("❌ Yous n'avez pas le droit d'ajouter de l'argent ! -[ADMINISTRATOR]");
        if (!args[0]) return message.channel.send("**Please Enter A User!**")

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
        if (!user) return message.channel.send("**Entrez un utilisateur valide !**")
        if (!args[1]) return message.channel.send("**Veuillez entrer un montant !**")
        if (isNaN(args[1])) return message.channel.send(`**❌  Votre montant n'est pas un chiffre!**`)
        if (args[0] > 10000) return message.channel.send("**Il est impossible d'ajouter un tel montant !**")
        db.add(`money_${user.id}`, args[1])
        let bal = db.fetch(`money_${user.id}`)

        let moneyEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`✅ Added ${args[1]} coins\n\nNew Balance: ${bal}`);
        message.channel.send(moneyEmbed)

    }
}