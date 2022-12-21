/**
 * Advent of Code 2022
 * 
 * https://adventofcode.com/2022/day/5
 * 
 */
'use strict';


const test = process.argv[2] || false
const input = test ? './procedure_t.txt' : './procedure.txt'

const fs = require('fs')
const contents = fs.readFileSync(input, 'utf-8')
// console.log(contents)

// scan each line for bracket while tracking number of characters
// 3 chars for letter, 1 for each bracket [] and 1 for the box letter, 1 for space between brackets
// when \r\n is detected, that is end of row, start over

// 1) calculate the number of stacks needed
const stacks = []
// procedures begin listing stacks at 1
const OFFSET = 1
const stackRows = contents.split('\r\n')
stacks.length = Math.ceil(stackRows[0].length / 4)
for (let i = 0; i < stacks.length; i++) {
    stacks[i] = new Array(0)
}

// parse each row and place crate in appropriate stack according to position in row
// 3 chars for crate, 1 for each bracket [] and 1 for the box letter, 1 for space between brackets
stackRowLoop: for (let i = 0; i < stackRows.length; i++) {
    for (let j = 0; j < stackRows[0].length; j += 4) {
        const str = stackRows[i].slice(j, j + 4).trim()
        if (str === '1') {
            break stackRowLoop
        }
        if (str !== '') {
            stacks[j / 4].unshift(str.charAt(1))
        }
    }
}

function copy2dArr(arr) {
    const copyArr = []
    arr.forEach(e => {
        copyArr.push([...e])
    })
    return copyArr;
}

const stacks9000 = copy2dArr(stacks)
const stacks9001 = copy2dArr(stacks)

/**
 * parse line procedures:
 * move: how many crates to move
 * from: which crate to move (stack element - OFFSET)
 * to: where to move it to (stack element - OFFSET)
 */
const proceduresStart = stackRows.findIndex(e => e.startsWith('move'))
const proceduresArr = stackRows.slice(proceduresStart)
proceduresArr.forEach(procedure => {
    const vals = procedure.match(/\d+/g)
    /**
     * the line procedures follow this pattern:
     * move [num] from [num] to [num]
     * regex match returns an array with:
     * vals[0] number of crates to move
     * vals[1] from stack
     * vals[2] to stack
     */

    // moves crates singly - order is reversed on to stack
    for (let i = 0; i < vals[0]; i++) {
        const crate9000 = stacks9000[vals[1] - OFFSET].pop()
        stacks9000[vals[2] - OFFSET].push(crate9000)
    }

    // moves crates without changing order
    const crates9001 = stacks9001[vals[1] - OFFSET].splice(-vals[0], vals[0])
    stacks9001[vals[2] - OFFSET] = stacks9001[vals[2] - OFFSET].concat(crates9001)

})

let topCrates9000 = ''
stacks9000.forEach(stack => topCrates9000 += stack[stack.length - 1])
console.log('stacks9000 top crates: ', topCrates9000)

let topCrates9001 = ''
stacks9001.forEach(stack => topCrates9001 += stack[stack.length - 1])
console.log('stacks9001 top crates: ', topCrates9001)



