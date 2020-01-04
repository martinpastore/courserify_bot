const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const fetch = require('node-fetch');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.command('start', (ctx) => ctx.reply(`Hey ${ctx.from.first_name} 😍! What do you want to learn today?? 📚`))
bot.command('course', (ctx) => findCourses(ctx, ctx.message.text.replace('/course ', '')))

const findCourses = (ctx, query) => {
    ctx.reply('Buscando ⏳');
    fetch(`https://www.udemy.com/api-2.0/courses/?search=${query}&price=price-free&ratings=3`, {
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Authorization": "",
            "Content-Type": "application/json;charset=utf-8"
        }
    })
    .then(resp => {
        if (resp.status !== 200 && resp.status !== 201) {
            handleError(ctx, resp.status)
        }

        const message = {
            title: resp.body.title,
            url: resp.body.url,
            rate: resp.body.avg_rate,
            image: resp.body.image_50x50
        }

        ctx.replyWithPhoto(
            message.image,
            Extra.caption(`${getStars(message.rate)} - ${message.title}: ${message.url}`).markdown()
        )
    })
    .catch(err => {
        ctx.reply("I didn't find related courses 😢");
    })
}

const getStars = (rate) => {
    let stars = '';
    
    for(let i = 0; i < Math.floor(rate); i++) {
        stars += '⭐';
    }

    return stars;
}

const handleError = (ctx, status) => {
    switch(status) {
        case 403:
        case 401:
            ctx.reply("Looks like you don't have permissions to do this, send me an email 📲: martinpablopastore@gmail.com 👈")
            break;
        case 500:
        case 400:
        case 404:
        case 502:
            ctx.reply("I didn't find related courses 😢");
            break;
    }
}

bot.launch();