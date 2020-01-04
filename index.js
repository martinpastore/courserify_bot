const Telegraf = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Hola ${ctx.from.first_name}! Sobre que vamos a aprender hoy??`))
bot.command('course', (ctx) => ctx.reply(ctx))