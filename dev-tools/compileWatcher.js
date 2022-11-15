const { LazyWatcher, LazyFS, LazyEncapProcess } = require('lazy-toolbox');
const { dateLogMS } = require('@friquet-luca/lazy-shared');
const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const settings = JSON.parse(fs.readFileSync(path.join(__dirname, './settings.json'), { encoding: 'utf8' }));

const extTriggers = settings.extensionTriggers;

let restartNode = false;
let clientCompile = false;
let serverCompile = false;
const _ROOT = path.join(__dirname, "../");

const serverRoot = path.join(_ROOT, settings.server);
const serverPath = path.join(_ROOT, settings.serverSource);
const clientPath = path.join(_ROOT, settings.clientSource);
const clientDest = path.join(_ROOT, settings.clientDestination);
const projectWatcher = new LazyWatcher(path.join(_ROOT, settings.source), 100);
const newNodeProcess = new LazyEncapProcess(_ROOT, serverRoot);
const compile = async (cmd) => {
    try {
        await exec(cmd);
    } catch(err) { }    
}
const eventTriggers = {
    "void": {
        triggered: false,
        execute: async () => {}
    },
    "compileTS": {
        triggered: false,
        execute: async () => {
            if(clientCompile) {
                console.log(dateLogMS("Start compiling Client TypeScript, please wait..."));
                LazyFS.deleteDirectory(clientDest);
                await compile('webpack');
                console.log(dateLogMS("Client TypeScript has been compiled!"));
            }
            if(serverCompile) {
                console.log(dateLogMS("Start compiling Server TypeScript, please wait..."));
                LazyFS.deleteDirectory(path.join(_ROOT, settings.serverDestination));
                await compile('tsc');
                console.log(dateLogMS("Server TypeScript has been compiled!"));
            }
        }
    },
    "compileSASS": {
        triggered: false,
        execute: async () => {
            console.log(dateLogMS("Start compiling stylesheets, please wait..."));
            LazyFS.deleteDirectory(path.join(_ROOT, settings.stylesheetDestination));
            await compile(`sass ${settings.stylesheetSource}:${settings.stylesheetDestination}`);
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
                restartNode |= extChanged.resetNode;
                eventTriggers[extChanged.toDo].triggered = true; // Set the trigger for that extension event
            }
        }
        if(restartNode && ((clientCompile && serverCompile) || (!clientCompile && serverCompile))) {
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
        if(restartNode && ((clientCompile && serverCompile) || (!clientCompile && serverCompile))) {
            newNodeProcess.start();
        }
        projectWatcher.watchFiles(watchFn);
    }
}
const startProgram = async () => {
    console.log(dateLogMS("Development mode started."));
    console.log(dateLogMS("You can quit the development mode at any time with CTRL + C on the terminal."));
    console.log(dateLogMS("Creating project, please wait..."));
    // Force a compilation at start (because there could have been changes before so...)
    clientCompile = true;
    serverCompile = true;
    await eventTriggers["compileTS"].execute();
    await eventTriggers["compileSASS"].execute();
    clientCompile = false;
    serverCompile = false;
    projectWatcher.skipChanges();
    // Start the server then start the dev watch
    newNodeProcess.start();
    projectWatcher.watchFiles(watchFn);
}
startProgram();