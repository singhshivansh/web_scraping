const request = require('request');
const cheerio = require('cheerio');

const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";


request(url, main_func);

function main_func(error, response, html){
    if(error){
        console.log(error);
    }
    get_view_all(html);
}


function get_view_all(html){
    const $ = cheerio.load(html);

    const view_all = $('[data-hover="View All Results"]');

    console.log(view_all.attr('href'));
}