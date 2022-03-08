const fs = require('fs')

function writeConfig(content:Object) {
    let data = JSON.stringify(content);
    fs.writeFileSync('./env.json', data)
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
        let rawdata = fs.readFileSync('./env.json');
        return JSON.parse(rawdata);
    }catch(e) {
        console.log("No env.json file found");
        return {}
    }
}

export = {
    load,
};