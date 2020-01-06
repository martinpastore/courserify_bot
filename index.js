const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const fetch = require('node-fetch');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.command('start', (ctx) => ctx.reply(`Hey ${ctx.from.first_name} 😍! What do you want to learn today?? 📚`))
bot.command('course', (ctx) => {
    console.log(`${ctx.from.username} has requested: ${ctx.message.text.replace('/course ', '')}`)
    findCourses(ctx, ctx.message.text.replace('/course ', ''))
})

const findCourses = (ctx, query) => {
    fetch(`https://www.udemy.com/api-2.0/courses/?search=${query}&price=price-free&ratings=3`, {
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Authorization": `Basic ${process.env.UDEMY_AUTHORIZATION}`,
            "Content-Type": "application/json;charset=utf-8"
        }
    })
    .then(response => response.json())
    .then(resp => botResponse(ctx, resp))
    .catch(err => {
        ctx.reply("I didn't find related courses 😢");
    })
}

const botResponse = (ctx, resp) => {
    if (!resp.results || !resp.results.length) {
        ctx.reply(resp.detail);
    }

    const i = Math.floor(Math.random() * resp.results.length)
    const message = getFormattedMessage(i, resp.results);

    ctx.replyWithPhoto(
        message.image,
        Extra.caption(`${message.title}: https://udemy.com${message.url}`).markdown(),
    )
}

const getFormattedMessage = (i, results) => {
    return {
        title: results[i].title,
        url: results[i].url,
        image: results[i].image_480x270
    };
}

bot.launch();