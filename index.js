const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const fs = require('fs');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_WEBHOOKS] });;
const channelDB = require("./channel.json");

client.login('BOT TOKEN'); 

client.on('messageCreate', async (message) =>{
    if(message.author.bot) return;
    if (message.webhookId) return;
    if(message.content == "<@!"+client.user.id+">" || message.content == "<@"+client.user.id+">"){
        if(message.member.permissions.has("ADMINISTRATOR")){
            message.delete();
            channelDB[message.guild.id] = {
                channel: message.channel.id,
              }
            fs.writeFile('./channel.json', JSON.stringify(channelDB), (err) => {
                if (err) {
                    console.log(err)
                    message.channel.send("An error has occurred");
                }else{
                    message.channel.send("Channel was set.");
                }
            });
        }
    }else{
        if(!(channelDB[message.guild.id])) return;
        if(message.channel.id === channelDB[message.guild.id].channel){
            client.channels.cache.forEach(async (channel) => { 
                if(!(channelDB[channel.guild.id])) return;
                if(channel.id == channelDB[channel.guild.id].channel){
                    let webhook = await channel.createWebhook(message.author.username, {avatar: message.author.displayAvatarURL()});
                    const hook = new Discord.WebhookClient({id: webhook.id, token: webhook.token});
                    await hook.send({
                        content: message.content
                    });
                    hook.delete();
                }
            })
            message.delete();
        }
    }
})
