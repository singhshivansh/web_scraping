const request = require('request');
const cheerio = require('cheerio');

const fs = require('fs');

// const url = "https://www.espncricinfo.com//series/ipl-2020-21-1210595/delhi-capitals-vs-kolkata-knight-riders-16th-match-1216515/full-scorecard";

function main_fn(url){
    request(url, (error, response, html)=>{
        if(error){
            console.log(error);
        }
        get_details(html);
    });
}

let team1, team2;



function get_details(html){
    const $ = cheerio.load(html);

    const match_blocks = $(".Collapsible");

    team1 = get_team_name(match_blocks[0]);
    team2 = get_team_name(match_blocks[1]);

    // console.log(team1, team2);

    const venue  = get_venue(html);
    const date   = get_date(html);
    const result = get_result(html);

    console.log(venue, date, result);

    for(let i=0; i<match_blocks.length; i++){
        const team_name = get_team_name(match_blocks[i]);
        // console.log(team_name);
        make_folder(team_name);
        batsman(match_blocks[i], team_name);
    }
}

const get_venue = (html) => {
    const $ = cheerio.load(html);
    const main_block = $(".match-info.match-info-MATCH");

    // console.log(main_block.find('.description').text().split(', ')[1]);
    return main_block.find('.description').text().split(', ')[1];
}

const get_date = (html) => {
    const $ = cheerio.load(html);
    const main_block = $(".match-info.match-info-MATCH");

    return main_block.find('.description').text().split(', ')[2];
}

const get_team_name = (html)=>{
    const $ = cheerio.load(html);

    // console.log($('.header-title.label').text());
    const team_name = $('.header-title.label').text().split('INNINGS')[0].trim();
    // console.log(team_name);
    return team_name;
}

const get_result = (html) => {
    const $ = cheerio.load(html);

    const main_block = $(".match-info.match-info-MATCH");

    // console.log(main_block.find('.status-text').text());
    return main_block.find('.status-text').text();
}

//creating folders on team name
const make_folder = (team_name) => {
    if(!fs.existsSync(`./IPL_Teams/${team_name}`))
        fs.mkdir(`./IPL_Teams/${team_name}`, (err)=>{
            if(err)
                console.log(err);
            console.log("Successfully Created");
        })
}

const batsman = (html, team_name)=>{
    const $ = cheerio.load(html);

    const batsman_team = team_name == team1 ? team1 : team2;

    const batsman_table = $('.table.batsman tbody tr');

    for(let i=0; i<batsman_table.length-1; i++){
        if(i%2 == 0){
            const batsman_cell = $(batsman_table[i]).find('td');

            //teamname // name //venue //date //opponent //result //runs //balls //fours //sixes //strike rate
            // console.log($(batsman_cell[0]).text(), $(batsman_cell[2]).text())
            console.log($(batsman_cell[0]).text(), batsman_team);
        }
    }
    
}


main_fn(url);