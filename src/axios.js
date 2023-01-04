"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setConfig = exports.httpCall = void 0;
const axios_1 = require("axios");
const console_1 = require("./console");
let maxRetries = 3;
let logAxiosDetails = false;
let retryAfter = 10;
// @ts-ignore
global.logLevel = 'log';
async function retryHttpCall(_config) {
    let reqRes;
    console_1.addConsole.debug("Url---", _config.url, 'retry count', maxRetries);
    for (let i = 0; i < maxRetries; i++) {
        try {
            console_1.addConsole.debug("Trying ---", i + 1);
            reqRes = await (0, axios_1.default)(_config);
            if (reqRes?.status == 200) {
                break;
            }
        }
        catch (error) {
            if (logAxiosDetails && axios_1.default.isAxiosError(error)) {
                axiosDetailedLogs(error);
            }
            else {
                const message = error.message;
                console_1.addConsole.debug("AXIOS ERROR", message);
            }
            if (i == (maxRetries - 1)) {
                return error;
            }
            await sleep(retryAfter);
        }
    }
    return reqRes;
}
async function httpCall(config) {
    validateBasicParams(config);
    const response = await retryHttpCall(config);
    return response;
}
exports.httpCall = httpCall;
function setConfig(config) {
    maxRetries = config.retry;
    logAxiosDetails = config.logAxiosDetails;
    retryAfter = config.retryAfter;
    // @ts-ignore
    global.logLevel = config.logLevel;
}
exports.setConfig = setConfig;
const sleep = (seconds) => {
    console_1.addConsole.debug(`Retrying after ${seconds} seconds\n`);
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
};
const axiosDetailedLogs = (error) => {
    if (error.response) {
        // server connected, but gave error
        console.log('Axios: Server gave Error:', error.response.status);
        console.log(error.response.data);
        console.log('Headers:', error.response.headers);
    }
    else if (error.request) {
        // server not reached
        console.log('Axios Server not reached', error.request);
    }
    else {
        // axios service error
        console.log('Axios Error', error.message);
    }
};
const validateBasicParams = (_config) => {
    const required = ['url', 'method', 'proxy'];
    required.forEach((field) => {
        const key = _config[field];
        if (key == undefined || key == null) {
            throw new Error(`${field} is required and cannot be empty`);
        }
    });
};
