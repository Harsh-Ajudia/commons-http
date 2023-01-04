import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { AxiosConfig } from '../types/index'
import { addConsole } from './console'

let maxRetries = 3
let logAxiosDetails = false
let retryAfter = 10

// @ts-ignore
global.logLevel = 'log'

async function retryHttpCall(_config: AxiosRequestConfig) {
    let reqRes

    addConsole.debug("Url---", _config.url, 'retry count', maxRetries)

    for (let i = 0; i < maxRetries; i++) {
        try {
            addConsole.debug("Trying ---", i + 1)
            reqRes = await axios(_config)
            if (reqRes?.status == 200) {
                break
            }
        } catch (error) {
            if (logAxiosDetails && axios.isAxiosError(error)) {
                axiosDetailedLogs(error)
            } else {
                const message = (error as Error).message
                addConsole.debug("AXIOS ERROR", message)
            }
            if (i == (maxRetries - 1)) {
                return error
            }
            await sleep(retryAfter)
        }
    }
    return reqRes
}

export async function httpCall(config: AxiosRequestConfig) {
    validateBasicParams(config)
    const response: AxiosResponse | unknown | undefined = await retryHttpCall(config)
    return response
}

export function setConfig(config: AxiosConfig) {
    maxRetries = config.retry
    logAxiosDetails = config.logAxiosDetails
    retryAfter = config.retryAfter
    // @ts-ignore
    global.logLevel = config.logLevel
}

const sleep = (seconds: number) => {
    addConsole.debug(`Retrying after ${seconds} seconds\n`)
    return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}

const axiosDetailedLogs = (error: AxiosError) => {
    if (error.response) {
        // server connected, but gave error
        console.log('Axios: Server gave Error:', error.response.status)
        console.log(error.response.data)
        console.log('Headers:', error.response.headers)
    } else if (error.request) {
        // server not reached
        console.log('Axios Server not reached', error.request)
    } else {
        // axios service error
        console.log('Axios Error', error.message);
    }
}

const validateBasicParams = (_config: AxiosRequestConfig) => {
    const required = ['url', 'method', 'proxy']
    required.forEach((field: string) => {
        const key = _config[field as keyof AxiosRequestConfig]
        if (key == undefined || key == null) {
            throw new Error(`${field} is required and cannot be empty`)
        }
    })
} 