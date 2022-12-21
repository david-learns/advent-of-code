/**
 * Advent of Code 2022
 * 
 * https://adventofcode.com/2022/day/4
 * 
 */
'use strict';

const fs = require('fs')

// pass in truthy command line arg to run test input
const test = process.argv[2] || false
const input = test ? './section-assignment_t.txt' : './section-assignment.txt'

const contents = fs.readFileSync(input,'utf-8')
const assignmentArr = contents.split('\r\n')
// console.log(assignmentArr)

let countFullOverlap = 0
let partialOverlap = 0
let simplePartialCount = 0

assignmentArr.forEach(e => {

    const pair = e.split(',')
    const elf1Sections= pair[0].split('-')
    const elf2Sections= pair[1].split('-')
    const elf1Start = Number(elf1Sections[0])
    const elf1End = Number(elf1Sections[1])
    const elf2Start = Number(elf2Sections[0])
    const elf2End = Number(elf2Sections[1])

    // console.log(`pair: ${pair}, e1s: ${elf1Start}, e1e: ${elf1End}, e2s: ${elf2Start}, e2e: ${elf2End}`)

    // counts only full overlaps
    if (elf1Start >= elf2Start && elf1End <= elf2End) {
        countFullOverlap++
    } else if (elf1Start <= elf2Start && elf1End >=elf2End) {
        countFullOverlap++
    }

    // counts all overlaps (including full)
    if (elf1Start <= elf2End && elf1Start >= elf2Start) {
        partialOverlap++
    } else if (elf1End >= elf2Start && elf1End <= elf2End) {
        partialOverlap++
    } else if (elf1Start >= elf2Start && elf1End <= elf2End) {
        partialOverlap++
    } else if (elf1Start <= elf2Start && elf1End >=elf2End) {
        partialOverlap++
    }
    
    /**
     * simplified counts all overlaps (including full)
     * it was easier for me to think about the condition in which things should *not* be counted
     */
    const conditionToCount = !((elf2Start > elf1Start && elf2Start > elf1End) || (elf2End < elf1Start && elf2End < elf1End))
    if (conditionToCount) {
        simplePartialCount++
    }

})

console.log('countFullOverlap part1:', countFullOverlap)
console.log('partialOverlap part2:', partialOverlap)
console.log('simplePartialCount part2:', simplePartialCount)
