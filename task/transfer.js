var fs = require("fs");
var path = require("path");
var readline = require("readline");
const r1 = readline.createInterface({
    input: fs.createReadStream(path.join(__dirname, "nlp.text"))
});
r1.on("line", line => {
    console.log(line);
    console.log('-------------------------------')
})