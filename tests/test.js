/**
 * Fot testing I am directly using node but you can use mocha or jest or any framework to suit your needs
*/
console.log('Starting tests')
const { httpCall, setConfig } = require('../index')
const fs = require('fs')
const path = require('path')
setConfig({
    retry: 3,
    logAxiosDetails: false,
    logLevel: 'log',
    retryAfter: 1
})
const cookie = ''

async function callApis() {
    try {
        let testCases = [
            {
                method: 'GET',
                url: '',
                proxy: false,
                data: {},
                headers: {},
                required: 200
            }
        ]

        if (fs.existsSync(path.resolve(process.cwd(), 'tests', 'cases.js'))) {
            const { cases } = require('./cases')
            testCases = cases
        }
        for await (const testCase of testCases) {
            try {
                const resp = await httpCall({
                    method: testCase.method,
                    url: testCase.url,
                    proxy: testCase.proxy,
                    data: testCase.data,
                    headers: testCase.headers,
                })
                console.log('URL:', testCase.url)
                if (resp.status == testCase.required) {
                    console.log(resp.status, 'Test Passed', resp.data, '\n')
                } else if (resp.response && resp.response.status) {
                    console.log(resp.response.status, 'Test Passed (not 200)', testCase.method, testCase.url, '\n')
                } else {
                    throw new Error(resp.message || 'Received different status code')
                }
            } catch (error) {
                console.log('Test Failed', testCase.method, testCase.url, error)
            }
        }
    } catch (error) {
        console.log('CATCH BLOCK', error)
    }
    console.log('Ending tests')

    process.exit(0)
}

callApis()