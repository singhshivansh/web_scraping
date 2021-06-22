let fs = require('fs');

let file_sys = fs.readFileSync('./json_example.json');

console.log(file_sys);

let data = JSON.parse(file_sys);

console.log(data);

data.push({
    "name" : "Barry Allen",
    "from" : "Earth",
    "age" : 32
})

const string_data = JSON.stringify(data);

fs.writeFileSync('./json_example.json', string_data);

// console.log(data)