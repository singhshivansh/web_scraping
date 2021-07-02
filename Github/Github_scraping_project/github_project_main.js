const request = require('request');
const cheerio = require('cheerio');

const fs = require('fs');
const path = require('path');
const pdfkit = require('pdfkit');

const base_url = 'https://github.com';

request(base_url + '/topics', main_fn);

function main_fn(error, response, html){
    if(error){
        console.log(error);
        return;
    }

    const $ = cheerio.load(html);

    const topic_box = $(".topic-box");

    for(let i=0; i<topic_box.length; i++){
        const url = base_url+ $(topic_box[i]).find('a').attr('href');
        request(url, get_issues);
    }
}

function get_issues(error, response, html){
    if(error){
        console.log(error);
        return;
    }
    const $ = cheerio.load(html);
    
    const topic = $('.h1').text().trim();

    root_folder();
    // console.log("topic", topic);
    make_topic_folder(topic);

    const articles = $('article .tabnav');

    // console.log(articles.length);

    if (articles.length >= 10){
        articles.length = 10;
    }
    //iterating through repos
    for(let i=0; i<articles.length; i++){
        const nav = $(articles[i]).find('a');
        const repo_name = $('.f3.color-text-secondary.text-normal.lh-condensed').text().trim();
        const issueLink = $(nav[1]).attr('href');
        getIssues(issueLink, repo_name, topic);
    }

}



function getIssues(issueLink, repoName, topic){
    // console.log(base_url +  issueLink);
    issueLink = base_url + issueLink;
    // console.log(issueLink);
    request(issueLink, (error, response, html)=>{
        if(error){
            console.log(error);
            return;
        }
    
        const $ = cheerio.load(html);
    
    
        const issueContainer = $('.js-navigation-container.js-active-navigation-container');
        const issuesArray    = issueContainer.find('.Box-row').find('.Link--primary');
        
        // console.log(issuesArray.length);
        let issuesArrays = [];
        for(let i=0; i<issuesArray.length; i++){
            const issue = $(issuesArray[i]).attr('href');
            const repo_name = issue.split('/')[1]+ "-" + issue.split('/')[2];
            // console.log($(issuesArray[i]).attr('href'), repo_name, topic);
            createJSON(topic, repo_name, issue);
            // createPDF(topic, repo_name, issue);
            issuesArrays.push(issue);
        }
        console.log(issuesArrays);
        
    });
}

function getIssues_driver(error, response, html, topic){
    if(error){
        console.log(error);
        return;
    }

    const $ = cheerio.load(html);


    const issueContainer = $('.js-navigation-container.js-active-navigation-container');
    const issuesArray    = issueContainer.find('.Box-row').find('.Link--primary');
    
    // console.log(issuesArray.length);
    for(let i=0; i<issuesArray.length; i++){
        // console.log($(issuesArray[i]).attr('href'));
    }

    
}

function root_folder(){
    const filePath_json = path.join(__dirname, "Github Topic Issues JSON");
    const filePath_pdf  = path.join(__dirname, "Github Topic Issues PDF");

    if(fs.existsSync(filePath_json) == false)
        fs.mkdirSync(filePath_json);
    
    if(fs.existsSync(filePath_pdf) == false)
        fs.mkdirSync(filePath_pdf);
}

function make_topic_folder(topicName){
    root_folder();

    const filePath_json = path.join(__dirname, "Github Topic Issues JSON", topicName);
    const filePath_pdf = path.join(__dirname, "Github Topic Issues PDF", topicName);

    if(fs.existsSync(filePath_json) == false)
        fs.mkdirSync(filePath_json);
    
    if(fs.existsSync(filePath_pdf) == false)
        fs.mkdirSync(filePath_pdf);
}

function createJSON(topic, repo_name, issueLink){
    // console.log(topic, repo_name, issueLink);
    // make_topic_folder(topic);
    const filePath = path.join(__dirname, "Github Topic Issues JSON", topic, repo_name + ".json");
    // console.log(filePath);

    if(fs.existsSync(filePath)){
        const fileContent = fs.readFileSync(filePath);
        const jsonData = JSON.parse(fileContent);
        jsonData.push(issueLink);

        const stringifyData = JSON.stringify(jsonData);

        fs.writeFileSync(filePath, stringifyData);
    }else{
        const jsonData = [];
        jsonData.push(issueLink);
        const stringifyData = JSON.stringify(jsonData);
        fs.writeFileSync(filePath, stringifyData);
    }
}


function createPDF(topic, repo_name, issueLink){
    const filePath = path.join(__dirname, "Github Topic Issues PDF", topic, repo_name + '.pdf');
    const doc = new pdfkit();
    doc.pipe(fs.createWriteStream(filePath));
    doc.text(issueLink);
    doc.end();
}