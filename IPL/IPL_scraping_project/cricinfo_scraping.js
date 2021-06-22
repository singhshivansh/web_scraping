const request = require('request');
const cheerio = require('cheerio');

const base_url = "https://www.espncricinfo.com/";

const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";

const each_match = require('./each_match_detail');

request(url, main_func);

function main_func(error, response, html){
    if(error){
        console.log(error);
    }
    const view_all_html = get_view_all(html);

    // console.log(view_all_html);
    request(view_all_html, get_all_matches);
}


function get_view_all(html){
    const $ = cheerio.load(html);

    const view_all = $('[data-hover="View All Results"]');
    const view_all_url = base_url+view_all.attr('href');

    console.log(view_all_url);
    return (view_all_url);
}


const get_all_matches = (error, response, html)=>{
    if(error){
        console.log(error);
    }

    const $ = cheerio.load(html);

    const main_container = $(".card.content-block.league-scores-container");

    const match_block_array = main_container.find(".match-score-block");

    console.log(match_block_array.length);

    for(let i=0; i<match_block_array.length; i++){
        const match_block =  $(match_block_array[i]).find(".match-info-link-FIXTURES");
        const match_url = $(match_block[0]).attr('href');

        // console.log(base_url+ match_url);
        each_match.main_fn(base_url+match_url);
        // console.log($(match_block[0]).attr('href'), "\n");
    }
}
