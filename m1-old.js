const a = {};

const fs = require('fs');
const bibao = "bibao";

a.no_change_func = function () {
    console.log('no change');
}

a.func = function () {
    var a1 = 111;
    var a2 = 222;
    console.log('func() in old file', a1, a2);
}

module.exports = a;

