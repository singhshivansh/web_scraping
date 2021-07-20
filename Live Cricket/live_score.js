const cheerio = require('cheerio');
const request = require('request');

const url = 'https://www.espncricinfo.com/';

request(url, main);

function main(error, response, html) {
    if(error){
        console.log(error);
        return;
    }
    const $ = cheerio.load(html);

    const match_bar = $('.leagues-container .featured-scoreboard .scorecard-container');
    // console.log(match_bar.length);
    let matches_index = [];
    for(let i=0; i<match_bar.length; i++){
        // console.log($(match_bar[i]).text());
        if($(match_bar[i]).text().toLowerCase().includes('india')){
            matches_index.push(i);
        }
    }

    const matchLink = url + $(match_bar[matches_index[0]]).find('a').attr('href');

    request(matchLink, matchInfo);
}


function matchInfo(error, response, html){
    if(error){
        console.log(error);
        return;
    }
    const $ = cheerio.load(html);
    const scoreCardTab = $('.widget-tabs.match-home-tabs').find('a');
    let index;
    for(let i=0; i<scoreCardTab.length; i++){
        if($(scoreCardTab[i]).text().toLowerCase().includes('scorecard')){
            // console.log("yess");
            index = i;
        }
    }
    const fullScorecardLink = url + $(scoreCardTab[index]).attr('href');
    request(fullScorecardLink, scorecardFn);
}

function scorecardFn(error, response, html){
    if(error){
        console.log(error);
        return;
    }

    const $ = cheerio.load(html);
    const matchSummary = $('.match-info.match-info-MATCH.match-info-MATCH-half-width');
    const teams = matchSummary.find('.teams .team');

    let teams_array = [];
    for(let i=0; i<teams.length; i++){
        const teamName = $(teams[i]).find('.name-detail').text();
        let scores;
        
        if($(teams[i]).find('.score-detail')){
            scores = $(teams[i]).find('.score-detail').text();
        }
        const obj = {
            Team : teamName,
            Score : scores
        }
        teams_array.push(obj);
    }
    console.table(teams_array);

    const scorecards = $('.card.content-block.match-scorecard-table .Collapsible');
    // console.log(scorecards.length);
    for(let i=0; i<scorecards.length; i++){
        const innings         = $($(scorecards[i]).find('.header-title.label')[0]);
        const innings_batsman = $($(scorecards[i]).find('.Collapsible__contentInner .table.batsman')[0]).find('tbody tr');
        const innings_bowler  = $(scorecards[i]).find('.Collapsible__contentInner .table.bowler').find('tbody tr');

        // console.log(innings_batsman.find('tbody').find('tr').length);
        // for(let i=0; i<innings_batsman.)
        // console.log("Batsman    ", "     Runs", "  Balls ", "  Fours  ", "  Sixes  ", "  Strike Rate  ");
        let batsman_array = []
        for(let i=0; i<innings_batsman.length-1; i++){
            if(i%2 == 0){
                const batsman           = $(innings_batsman[i]).find('td');
                
                const batman_obj        = {
                    "Name" : $(batsman[0]).text().trim(),
                    "Status" : $(batsman[1]).text().trim(),
                    "Runs" : $(batsman[2]).text().trim(),
                    "Balls" : $(batsman[3]).text().trim(),
                    "Fours" : $(batsman[5]).text().trim(),
                    "Sixes" : $(batsman[6]).text().trim(),
                    "Strike Rate" :$(batsman[7]).text().trim() 
                }
                batsman_array.push(batman_obj);
            }
        }

        
        let bowlers_array = []
        for(let i=0; i<innings_bowler.length; i++){
                const bowler = $(innings_bowler[i]).find('td');
                const bowler_obj = {
                    Name : $(bowler[0]).text().trim(),
                    Overs : $(bowler[1]).text().trim(),
                    Maiden : $(bowler[2]).text().trim(),
                    Runs : $(bowler[3]).text().trim(),
                    Wickets : $(bowler[4]).text().trim(),
                    Economy : $(bowler[5]).text().trim(),
                    Wide    : $(bowler[8]).text().trim(),
                    "No Ball" : $(bowler[9]).text().trim(),
                }
                bowlers_array.push(bowler_obj);
        }
        console.table(batsman_array);
        console.table(bowlers_array);
    }
}