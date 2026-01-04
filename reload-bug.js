const { exec } = require('child_process');

const fs = require('fs');

fs.copyFileSync('./m1-old.js', './m1.js');

const path = require('path');

const reloader = require("./reloader");

const m1 = require('./m1');
const f0 = m1.func;

function do_test() {
    console.log("---- call m1.func();");
    m1.func();

    console.log("---- call f0;");
    f0();

    console.log("---- call m1new.func();");
    const m1new = require('./m1');
    m1new.func();

    console.log("");
}

do_test();

function do_reload() {
    var filename = "m1.js";
    var filePath = path.join(__dirname, filename);
    filePath = filePath.replace(/\\/g, '/');

    let file = fs.readFileSync(filePath);
    if (file && file.toString().length > 1) {
        content = file.toString();
        reloader(filePath, content);

        do_test();
    }
}

setTimeout(() => {
    fs.copyFileSync('./m1-new.js', './m1.js');
}, 1000);

setTimeout(() => {
    do_reload();
}, 2000);

setTimeout(() => {
    fs.copyFileSync('./m1-new-new.js', './m1.js');
}, 3000);

setTimeout(() => {
    do_reload();
}, 4000);


// keep running
setInterval(() => {
}, 1000)
