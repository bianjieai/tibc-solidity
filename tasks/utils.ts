const fs = require('fs')

function writeEnv(content:Object) {
    let data = JSON.stringify(content);
    fs.writeFileSync('./env.json', data)
}

async function readAndWriteEnv(callback:Function) {
    let env = readEnvSync();
    await callback(env);
    writeEnv(env);
}

async function readEnv(callback: Function) {
    let env = readEnvSync();
    await callback(env);
}

function readEnvSync() {
    try { 
        let rawdata = fs.readFileSync('./env.json');
        return JSON.parse(rawdata);
    }catch(e) {
        console.log("No env.json file found");
        return {}
    }
}

export = {
    readEnv,
    readAndWriteEnv,
};