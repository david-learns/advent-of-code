/**
 * Advent of Code 2022
 * 
 * https://adventofcode.com/2022/day/1
 * 
 */
'use strict';

let maxCals = 0
const top3Cals = []
const https = require('http')

// pass in truthy command line arg to run test file
require('./test-server')(process.argv[2] || false)

https.get('http://localhost:8080', res => {

    res.setEncoding('utf-8')
    let calsData = ''
    res.on('data', chunk => calsData += chunk)
    res.on('end', () => {
        const calsArr = calsData.split('\n\n')
        console.log(calsArr)
        calsArr.forEach(e => {
            const calsCarried = e.split('\n')
            let sum = 0
            calsCarried.forEach(e => {
                sum += Number(e)
            });
            top3(sum)
            if (sum > maxCals) {
                maxCals = sum
            }
        })

        console.log('maxCals', maxCals)
        console.log('top3Cals sum: ', top3Cals.reduce((prev, curr) => prev + curr))
        process.exit(0)
    })
    
}).on('error', e => {
    console.log(e.message)
})

function top3(cals) {
    if (top3Cals.length < 3) {
        top3Cals.push(cals)
        top3Cals.sort()
    } else {
        for (let i = 0; i < top3Cals.length; i++) {
            if (top3Cals[i] <= cals) {
                top3Cals.splice(i, 0, cals)
                top3Cals.pop()
                break;
            }
        }
    }
}
