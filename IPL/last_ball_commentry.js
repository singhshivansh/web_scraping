const cheerio = require('cheerio');
const chalk   = require('chalk');
const request = require('request');

const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/chennai-super-kings-vs-kings-xi-punjab-53rd-match-1216506/ball-by-ball-commentary";

request(url, cb_func);

function cb_func(error, response, html){
    if(error){
        console.log("error");
    }
    handleHTML(html);
}


function handleHTML(html){
    const $ = cheerio.load(html);
    const last_commentry = $(".d-flex.match-comment-padder.align-items-center");

    const text_last_commentry = $(last_commentry[0]).text();
    const html_last_commentry = $(last_commentry[0]).html();

    console.log(text_last_commentry, html_last_commentry);
}