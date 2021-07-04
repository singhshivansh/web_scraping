const request = require('request');
const cheerio = require('cheerio');

const url = 'https://www.imdb.com/list/ls021778931/';

request(url, main);

function main(error, response, html){
    if(error)
        console.log(error);
    
    const $ = cheerio.load(html);

    const movie_list = $('.lister-list').find('.lister-item-content');

    // console.log(movie_list.length);
    for(let i=0; i<movie_list.length; i++){
        get_movie_details(movie_list[i]);
    }
}

function get_movie_details(movie_element){
    const $ = cheerio.load(movie_element);
    const movie_name = $('.lister-item-header').text().split('.')[1].split('(')[0].trim();
    const year       = $('.lister-item-year.text-muted.unbold').text().split(' ');
    console.log(year);
}