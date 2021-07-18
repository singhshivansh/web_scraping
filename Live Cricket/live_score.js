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
    // console.log(fullScorecardLink);
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

    for(let i=0; i<teams.length; i++){
        const teamName = $(teams[i]).find('.name-detail').text();
        let scores;
        
        if($(teams[i]).find('.score-detail')){
            scores = $(teams[i]).find('.score-detail').text();
        }

        console.log(teamName, scores);
    }

    const scorecards = $('.card.content-block.match-scorecard-table .Collapsible');
    // console.log(scorecards.length);
    for(let i=0; i<scorecards.length; i++){
        const innings         = $($(scorecards[i]).find('.header-title.label')[0]);
        const innings_batsman = $($(scorecards[i]).find('.Collapsible__contentInner .table.batsman')[0]);
        const innings_bowler  = $(scorecards[i]).find('.Collapsible__contentInner .table.bowler');

        // console.log(innings.text());
        // for(let i=0; i<innings_batsman.)
    }
}
