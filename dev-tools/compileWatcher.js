const { LazyWatcher, LazyEncapProcess } = require('lazy-toolbox');
const { dateLogMS } = require('@lazy-toolbox/portable');
const fs = require('fs');
const path = require('path');
const util = require('util');
const childProcess = require('child_process');
const exec = util.promisify(childProcess.exec);

const settings = JSON.parse(fs.readFileSync(path.join(__dirname, './settings.json'), { encoding: 'utf8' }));

const extTriggers = settings.extensionTriggers;

let restartNode = false;
let clientCompile = false;
let serverCompile = false;
const _ROOT = path.join(__dirname, "../");

const serverPath = path.join(_ROOT, settings.serverSource);
const clientPath = path.join(_ROOT, settings.clientSource);
const projectWatcher = new LazyWatcher(path.join(_ROOT, settings.source), 100);
const newNodeProcess = new LazyEncapProcess(_ROOT, settings.server, settings.processArgs);
const compile = async (cmd) => {
    try {
        await exec(cmd);
    } catch(err) { }    
}

const eventTriggers = {
    "void": {
        triggered: false,
        execute: async () => { console.log(dateLogMS("Void event happening...")); }
    },
    "compileSC": {
        triggered: false,
        execute: async () => {
            console.log(dateLogMS("Start compiling, please wait..."));
            await compile(settings.commands.compileSC);
            console.log(dateLogMS("Client and server has been compiled!"));
        }
    },
    "compileTS": {
        triggered: false,
        execute: async () => {
            if(clientCompile) {
                console.log(dateLogMS("Start compiling Client TypeScript, please wait..."));
                await compile(settings.commands.compileTS.client);
                console.log(dateLogMS("Client TypeScript has been compiled!"));
            }
            if(serverCompile) {
                console.log(dateLogMS("Start compiling Server TypeScript, please wait..."));
                await compile(settings.commands.compileTS.server);
                console.log(dateLogMS("Server TypeScript has been compiled!"));
            }
        }
    },
    "compileSASS": {
        triggered: false,
        execute: async () => {
            console.log(dateLogMS("Start compiling stylesheets, please wait..."));
            await compile(settings.commands.compileSASS);
            console.log(dateLogMS("All stylesheets have been compiled!"));
        }
    }
};
const excluded = (path, pathsExcluded) => {
    for(const item of pathsExcluded)
    {
        if(path.length >= item.length)
        {
            let slice = path.substring(0, item.length);
            if(slice == item)
            {
                return true;
            }
        }
    }
    return false;
};
const watchFn = async (events) => {
    const changesOccured = events.length > 0;
    if(changesOccured) {
        projectWatcher.stop();
        restartNode = false;
        clientCompile = false;
        serverCompile = false;
        // Check specific trigger files
        for(let event of events) {
            // It's a path to ignore
            if(excluded(path.relative(_ROOT, event.file), settings.ignore)) {
                continue; // Let's go next iteration
            }
            let fileExt = path.extname(event.file);
            if(fileExt === '') {
                fileExt = path.basename(event.file);
            }
            // TS is special handled..
            if(fileExt === ".js" || fileExt === ".mjs" || fileExt === ".ts" || fileExt === ".mts") {
                // Is a source
                if(event.file.length >= serverPath.length && event.file.substring(0, serverPath.length) == serverPath) {
                    // It's a client source for sure
                    if(event.file.length >= clientPath.length && event.file.substring(0, clientPath.length) == clientPath) {
                        clientCompile = true;
                    } else { // Anything else than a client source is just a server side element
                        serverCompile = true;
                    }
                }
            }
            const extChanged = extTriggers[fileExt];
            if(extChanged) { // Check if it's an handled extension
                restartNode |= extChanged.resetNode ? true : false;
                eventTriggers[extChanged.toDo].triggered = true; // Set the trigger for that extension event
            }
        }
        if(restartNode) {
            newNodeProcess.stop();
        }
        // Execute all triggers in order
        for(let evTrig in eventTriggers) {
            const actualEvent = eventTriggers[evTrig]; // Get the actual event
            if(actualEvent.triggered) { // The event is triggered
                await actualEvent.execute(); // Execute the event then
                actualEvent.triggered = false;
            }
        }
        if(restartNode) {
            newNodeProcess.start();
        }
        projectWatcher.watchFiles(watchFn);
    }
}
const startProgram = async () => {
    console.log(dateLogMS("Development mode started."));
    // Start the server then start the dev watch
    newNodeProcess.start();
    projectWatcher.watchFiles(watchFn);
}
startProgram();