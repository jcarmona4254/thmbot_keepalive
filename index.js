const mod = require("./test.js");
const keepAlive = require('./server');

console.log('start ...');
console.log(new Date().toUTCString() + '\n');

const { Client, Intents } = require('discord.js');

const my_intents = {intents:["GUILDS","GUILD_MESSAGES"]};
const bot = new Client(my_intents);

const token = process.env['token'];
const url = process.env['url'];

//

const request = require("request-promise");
const cheerio = require("cheerio");

//


var usr = '';
var usr_lvl = '';
var num_req = 0;


function check_lvl (msg,username){
  var usrnme_exists = true;
  
  request(url + username, (error, response, html) => {
    if(!error && response.statusCode==200) {

      const $= cheerio.load(html);
      var find_usr_lvl = $(".profile-stat");

      i = 0;
      find_usr_lvl.each(function (idx, el) {
        if (i == 2){
          usr_lvl = $(el).text().toString().match(/\d+/); //found lvl!
          msg.channel.send(username + ' is lvl ' + usr_lvl + '!' + ' | <' + url+username + '>' );
        }
        i++;
      });
    }
    else {
      usrnme_exists = false;
      msg.channel.send('woops, error (check your spelling)');
    } 

    console.log("query: " + msg.content)
    console.log('username: ' + username)
    console.log('time : ' + new Date().toUTCString());
    console.log('usrnme exists: ' + usrnme_exists + '\n');
  
  }).catch(error => console.log());
}

//


bot.on('ready', () => {
  console.log('bot status: ready\n')
});

var prefix = '!';

bot.on('messageCreate', (msg) => {
  if (msg.author == bot.user) {
    return;
  }
  else {
    if(msg.content[0] == prefix){
      var msg_args = msg.content.slice(prefix.length).trim().split(' ');
      check_lvl(msg,msg_args[1]);
    }
  } 
});

//

keepAlive();
bot.login(token);
