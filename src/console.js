"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addConsole = void 0;
let logLevels = ["debug", "log", "warn", "error", "none"];
const addOutput = (level) => {
    // @ts-ignore
    return logLevels.indexOf(level) >= logLevels.indexOf(global.logLevel);
};
exports.addConsole = {
    debug: (message, ...data) => {
        addOutput('debug') && console.debug(message, ...data);
    },
    log: (message, ...data) => {
        addOutput('log') && console.log(message, ...data);
    },
    warn: (message, ...data) => {
        addOutput('warn') && console.warn(message, ...data);
    },
    error: (message, ...data) => {
        addOutput('error') && console.error(message, ...data);
    }
};
