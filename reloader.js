const inspector = require('inspector');

const session = new inspector.Session();
const scriptIds = {};
session.connect();
session.post("Runtime.enable", (error, r) => {
    if (error) {
        logger.error('hotSwapUtil runtime.enable error = ', error);
    }
});

session.post("Debugger.enable", {}, (error, r) => {
    if (error) {
        logger.error('hotSwapUtil Debugger.enable error = ', error);;
    }
});

session.addListener('Debugger.scriptParsed', (message) => {
    // console.log("scriptParsed", message);
    scriptIds[message.params.url] = message.params.scriptId;
});

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function reload(fileUrl, scriptContent) {
    var scriptId;
    for (let url in scriptIds) {
        if (endsWith(url, fileUrl)) {
            scriptId = scriptIds[url];
        }
    }
    if (scriptId !== undefined) {
        session.post('Debugger.setScriptSource', {
            scriptId: scriptId,
            scriptSource: scriptContent
        }, (error, r) => {
            console.log('reload', fileUrl, error, r);
            if (error) {
                console.log('hotSwapUtil Debugger.setScriptSource error = ', error);
            } else {
                if (r.exceptionDetails) {
                    console.log('hotSwapUtils setScripte exception = ', JSON.stringify(r.exceptionDetails));
                }
                console.log('reload', fileUrl);
            }
        });
    }
}

module.exports = reload;

