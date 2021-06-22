const request = require('request');
const cheerio = require('cheerio');
const xlsx    = require('xlsx');

const fs = require('fs');
const path = require('path');

const url = "https://www.espncricinfo.com//series/ipl-2020-21-1210595/delhi-capitals-vs-kolkata-knight-riders-16th-match-1216515/full-scorecard";

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

    console.log(result);

    for(let i=0; i<match_blocks.length; i++){
        const team_name = get_team_name(match_blocks[i]);
        // console.log(team_name);
        parentFolder();
        make_folder(team_name);
        batsman(match_blocks[i], team_name, venue, date, result);
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

const parentFolder = () => {
    const filePath = path.join(__dirname, 'IPL_Teams');
    if(!fs.existsSync(filePath))
        fs.mkdirSync(filePath);
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


const batsman = (html, team_name, venue, date, result)=>{
    const $ = cheerio.load(html);

    const batsman_team = team_name == team1 ? team1 : team2;
    const opponent_team = team_name == team1 ? team2 : team1;

    const batsman_table = $('.table.batsman tbody tr');

    for(let i=0; i<batsman_table.length-1; i++){
        if(i%2 == 0){
            const batsman_cell = $(batsman_table[i]).find('td');

            //teamname // name //venue //date //opponent //result //runs //balls //fours //sixes //strike rate

            
            const playerData = {
                "Team Name" : batsman_team,
                "Name" : $(batsman_cell[0]).text().trim(),
                "Venue" : venue.trim(),
                "Date" : date.trim(),
                "Opponent Team" : opponent_team.trim(),
                "Result" : result.trim(),
                "Runs" : $(batsman_cell[2]).text().trim(),
                "Balls Faced" : $(batsman_cell[3]).text().trim(),
                "Fours" : $(batsman_cell[5]).text().trim(),
                "Sixes" : $(batsman_cell[6]).text().trim(),
                "Strike Rate" : $(batsman_cell[7]).text().trim()
            }

            processPlayer(playerData, team_name, $(batsman_cell[0]).text().trim());
        }
    }
    
}


const processPlayer = (playerData, teamName, playerName)=>{
    parentFolder();

    const filePath = path.join(__dirname, 'IPL_Teams', teamName, playerName + ".xlsx");
    let content = excelReader(filePath, playerName);

    content.push(playerData);

    excelWriter(filePath, content, playerName);
    jsonWriter(teamName, playerData, playerName);
}


const excelWriter = (filePath, data, sheetName)=>{
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, filePath);
}

const jsonWriter = (teamName, data, playerName) => {
    const filePath = path.join(__dirname, "IPL_Teams", teamName, playerName + ".json");
    if(fs.existsSync(filePath) == false){
        // fs.mkdirSync(filePath);
        const st = [];
        st.push(data);
        const stringify_data = JSON.stringify(st);

        fs.writeFileSync(filePath, stringify_data);
    }else{
        let fileData = fs.readFileSync(filePath);
        let fileDatajson = JSON.parse(fileData);
        fileDatajson.push(data);

        let stringifyData = JSON.stringify(fileDatajson);

        fs.writeFileSync(filePath, stringifyData);
    }

}

const excelReader = (filePath, sheetName)=>{
    if(fs.existsSync(filePath) == false)
        return [];
    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);

    return ans;
}


// main_fn(url);


module.exports = {
    main_fn : main_fn
}