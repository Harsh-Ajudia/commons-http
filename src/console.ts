let logLevels = ["debug", "log", "warn", "error", "none"]
import { LogLevel } from '../types/index'

const addOutput = (level: LogLevel) => {
    // @ts-ignore
    return logLevels.indexOf(level) >= logLevels.indexOf(global.logLevel)
}

export const addConsole = {
    debug: (message?: any, ...data: any[]) => {
        addOutput('debug') && console.debug(message, ...data)
    },
    log: (message?: any, ...data: any[]) => {
        addOutput('log') && console.log(message, ...data)
    },
    warn: (message?: any, ...data: any[]) => {
        addOutput('warn') && console.warn(message, ...data)
    },
    error: (message?: any, ...data: any[]) => {
        addOutput('error') && console.error(message, ...data)
    }
}

