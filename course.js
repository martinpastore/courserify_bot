const Extra = require('telegraf/extra');
const fetch = require('node-fetch');
require('dotenv').config();

const findCourses = (ctx, args) => {
    const query = args.filter(a => a.indexOf('query=') > -1)[0] || '';
    const language = args.filter(a => a.indexOf('language=') > -1)[0] || '';
    fetch(`https://www.udemy.com/api-2.0/courses/?search=${query.replace('query=', '')}&language=${language.replace('language=', '')}&page_size=50&ordering=newest&price=price-free&ratings=3`, {
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

module.exports = { findCourses };