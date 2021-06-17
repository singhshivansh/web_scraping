const request = require('request');
const cheerio = require('cheerio');
const { val } = require('cheerio/lib/api/attributes');


const url = "https://www.espncricinfo.com/series/ipl-2021-1249214/chennai-super-kings-vs-royal-challengers-bangalore-19th-match-1254076/full-scorecard";

request(url, cb);

function cb(error, response, html){
    if(error){
        console.log(error);
    }else{
        extractHTML(html);
    }
}

function extractHTML(html){
    const $ = cheerio.load(html);
    const teams = $(".Collapsible");

    for(let i=0; i<teams.length; i++){
        extractCollapsible(teams[i]);
    }
}

function extractCollapsible(html){
    const $ = cheerio.load(html);

    const team_name = $(".header-title.label");
    const batsman_table = $(".table.batsman").find('tbody tr .batsman-cell');

    console.log("\n",team_name.text().split("INNINGS")[0].trim());
    // for(let i=0; i<batsman_table.length; i++){
    //     // console.log($(batsman_table[i]).text());
    //     console.log($(batsman_table[i]).attr());
    // }
    // console.log(batsman_table);
    batsman_table.each((index, value)=>{
        let a = $(value).html();
        extractBirtdays($(a).attr('href'), $(a).text());
    })
    console.log("\n");
}


function extractBirtdays(url, name){
    // console.log(url);
    const base_url = "https://www.espncricinfo.com/";

    request(base_url+url, batsman_cb);
}


function batsman_cb(error, response, html){
    const $ = cheerio.load(html);

    const batsman_bd = $(".player-card-description.gray-900");

    console.log($(batsman_bd[0]).text(), " : " , $(batsman_bd[1]).text(),"\n");
}