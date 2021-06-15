const request   = require('request');
const cheerio   = require('cheerio');
const chalk     = require("chalk");

console.log("Before");
const url = "https://www.worldometers.info/coronavirus";

request(url, cb);

function cb(error, response, html){
    if(error){
        console.log(error);
    }else{
        // console.log(html);
        handleHTML(html);
    }
}

function handleHTML(html){
    const $ = cheerio.load(html);
    // console.log($('.maincounter-number').text());
    const numbers = $('.maincounter-number');

    //total cases
    const total_numbers = $(numbers[0]);
    console.log(chalk.grey("Total Number :", total_numbers.text()));

    //total_deaths
    const total_deaths = $(numbers[1]);
    console.log(chalk.red("Total Deaths : ", total_deaths.text()));

    //total_recoveries
    const total_recovery = $(numbers[2]);
    console.log(chalk.green("Total Recoveries", total_recovery.text()));
}

console.log("After");