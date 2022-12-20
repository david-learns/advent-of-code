/**
 * Advent of Code 2022
 * 
 * https://adventofcode.com/2022/day/6
 * 
 */
'use strict';

const test = process.argv[2] || false
const input = test ? 'data-stream_t.txt' : 'data-stream.txt'


/**
 * 
 * detect start-of-packet and start-of-message markers - four or 14 unique
 * characters, respectively
 * 
 * input is data stream of characters in text file
 * 
 * find first position with four unique characters
 * 
 * return the number of characters from the beginning of the text file to
 * the end of the first set unique characters
 * 
 */

const fs = require('fs')
const characterStream = fs.readFileSync(input, 'utf-8')

const START_OF_PACKET_OFFSET = 3
const START_OF_MESSAGE_OFFSET = 13

console.log('part1 index:', getMarker(characterStream, START_OF_PACKET_OFFSET))
console.log('part2 index:', getMarker(characterStream, START_OF_MESSAGE_OFFSET))

function getMarker(characterStream, OFFSET) {

    let index = -1

    for (let i = 0; i < characterStream.length - OFFSET; i++) {

        const fourChars = characterStream.slice(i, i + OFFSET + 1)
        const areUnique = uniqueChars(fourChars)
        // console.log(`fourChars: ${fourChars}, areUnique: ${areUnique}, i: ${i}, len: ${i + OFFSET + 1}`)
        if (areUnique) {
            index = i + OFFSET + 1
            break
        }
    }

    return index
}

function uniqueChars(str) {
    const uniqueChArr = []
    for (const char of str) {
        if (uniqueChArr.includes(char)) {
            return false
        } else {
            uniqueChArr.push(char)
        }
    }
    return true
}
