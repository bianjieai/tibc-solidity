const fs = require('fs')

function writeConfig(content:Object) {
    let data = JSON.stringify(content, null,'\t');
    fs.writeFileSync('./tibcconfig.json', data)
}

async function load(callback: Function,override:Boolean = false) {
    let env = loadSync();
    await callback(env);
    if(override) {
        writeConfig(env);
    }
}

function loadSync() {
    try { 
        let rawdata = fs.readFileSync('./tibcconfig.json');
        return JSON.parse(rawdata);
    }catch(e) {
        console.log("no tibcconfig.json file found");
    }
}

export = {
    load,
};