const cheerio = require('cheerio');
const chalk   = require('chalk');
const request = require('request');
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

    const winning_team = winning_team_fn(html);
    const loosing_team = loosing_team_fn(html);

    const team_array = $('.Collapsible');

    let highest_wickwt_taker = "";
    let highest_wicket = 0;

    for(let i=0; i<team_array.length; i++){
        if($(team_array[i]).find('.header-title.label').text().split("INNINGS")[0].trim() == loosing_team){
            const main_table    = $(team_array[i]); 
            const bowler_table  = main_table.find(".table.bowler");
            const bowlers = bowler_table.find('tbody').find('tr');

            for(let j=0; j<bowlers.length; j++){
                // console.log($($(bowlers[j]).find('td')[4]).text());
                if( $($(bowlers[j]).find('td')[4]).text() > highest_wicket){
                    highest_wicket = $($(bowlers[j]).find('td')[4]).text();
                    highest_wickwt_taker = $($(bowlers[j]).find('td')[0]).text();
                }
            }
        }
    }

    // console.log(highest_wicket, highest_wickwt_taker);
    // man_of_the_match(html);

    console.log(chalk.green("Winning Team           : ", winning_team));
    console.log(chalk.blue("Highest Wicket Taker   : ", highest_wickwt_taker));
    console.log(chalk.magenta("Highest Wicket Taken   : ", highest_wicket));
    console.log(chalk.redBright("Man of the Match       :", man_of_the_match(html)));

    // console.log(winning_team)
}


function winning_team_fn(html){
    const $ = cheerio.load(html);

    let winning_team = "";
    const teams = $(".match-info.match-info-MATCH .team");

    for(let i=0; i<teams.length; i++){
        if(!$(teams[i]).hasClass('team-gray')){
            winning_team = $(teams[i]).find('.name').text();
        }
    }
    return winning_team;
}

function loosing_team_fn(html){
    const $ = cheerio.load(html);

    let winning_team = "";
    const teams = $(".match-info.match-info-MATCH .team");

    for(let i=0; i<teams.length; i++){
        if($(teams[i]).hasClass('team-gray')){
            winning_team = $(teams[i]).find('.name').text();
        }
    }
    return winning_team;
}

function man_of_the_match(html){
    const $ = cheerio.load(html);

    const best_player = $(".best-player-name");

    return (best_player.text());
}