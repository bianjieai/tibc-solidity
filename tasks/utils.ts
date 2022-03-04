const fs = require('fs')

function writeEnv(content:Object) {
    let data = JSON.stringify(content);
    fs.writeFileSync('./env.json', data)
}

async function readAndWriteEnv(callback:Function) {
    let env = readEnv();
    await callback(env);
    writeEnv(env);
}

function readEnv() {
    try { 
        let rawdata = fs.readFileSync('./env.json');
        return JSON.parse(rawdata);
    }catch(e) {
        console.log("No env.json file found");
        return {}
    }
}

export = {
    writeEnv,
    readEnv,
    readAndWriteEnv,
};