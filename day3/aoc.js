/**
 * Advent of Code 2022
 * 
 * https://adventofcode.com/2022/day/3
 * 
 */
'use strict';

const test = process.argv[2] || false

const input = test ? './rucksacks_t.txt' : './rucksacks.txt'

day3p1()
day3p2()

function day3p1() {

    const fs = require('fs')

    const priority = new Map()

    for (let i = 1; i < 27; i++) {
        priority.set(String.fromCharCode(i + 96), i)
    }
    for (let i = 27; i < 53; i++) {
        priority.set(String.fromCharCode(i  + 38), i)
    }

    const contents = fs.readFileSync(input,'utf-8')
    const sackArr = contents.split('\r\n')

    let prioritySum = 0
    for (let i = 0; i < sackArr.length; i++) {

        const cmp1Arr = sackArr[i].slice(0, sackArr[i].length / 2)
        const cmp2Arr = sackArr[i].slice(sackArr[i].length / 2)
        
        cmpLoop: for (let i = 0; i < cmp1Arr.length; i++) {
            
            for (let j = 0; j < cmp2Arr.length; j++) {
                
                if (cmp1Arr[i] === cmp2Arr[j]) {
                    prioritySum += priority.get(cmp1Arr[i])
                    break cmpLoop
                }
            }
        }
    }
    console.log('sum of priorities part 1:',prioritySum)
}




function day3p2() {
    const fs = require('fs')

    const priority = new Map()

    for (let i = 1; i < 27; i++) {
        priority.set(String.fromCharCode(i + 96), i)
    }
    for (let i = 27; i < 53; i++) {
        priority.set(String.fromCharCode(i  + 38), i)
    }

    const contents = fs.readFileSync(input,'utf-8')
    const sackArr = contents.split('\r\n')

    let prioritySum = 0
    const group = []
    for (let i = 0; i < sackArr.length; i++) {
        
        group.push(sackArr[i])
        if (group.length === 3) {
            
            for (const item of group[0]) {
                if (group[1].includes(item) && group[2].includes(item)) {
                    prioritySum += priority.get(item)
                    break
                }
            }
            group.length = 0
        }
    }
    console.log('sum of priorities part 2:',prioritySum)
}
