/**
 * Advent of Code 2022
 * 
 * https://adventofcode.com/2022/day/9
 * 
 */
'use strict';

/**
 * use command line arg:
 * 'p1' for part 1 test file
 * 'p2' for part 2 test file
 */
const arg = process.argv[2] || false
const input = whichInput(arg)

// prepare input file
const fs = require('fs')
const contents = fs.readFileSync(input, 'utf-8')
const motions = contents.split('\r\n')

// find grid needed parameters
const gridNeededParams = findBoundaries(motions)
const gridSideLen = calcGridSideLen(gridNeededParams)

// build 2d grid with side length - each cell initialized to false
let grid = build2dGrid(gridSideLen)

const PART1 = 2
const PART2 = 10

let headKnot = null

// part 1
buildRope(PART1)
parseMotions(motions, grid, headKnot)
let numTrues = truthCounts(grid)
console.log('tail visitations part 1:', numTrues)

// part 2
grid = build2dGrid(gridSideLen)
headKnot = null
buildRope(PART2)
parseMotions(motions, grid, headKnot)
numTrues = truthCounts(grid)
console.log('tail visitations part 2:', numTrues)





function build2dGrid(gridSideLen) {
    const grid = []
    for (let i = 0; i < gridSideLen; i++) {
        const arr = []
        arr.length = gridSideLen
        grid.push(arr.fill(false))
    }
    return grid
}




function whichInput(arg) {
    switch (arg) {
        case 'P1':
        case 'p1': return 'motion-series_p1_t.txt'
        case 'P2':
        case 'p2': return 'motion-series_p2_t.txt'
        default: return 'motion-series.txt'
    }
}




function findBoundaries(motions) {

    const position = { x: 0, y: 0 }
    let maxRight = 0, maxLeft = 0, maxUp = 0, maxDown = 0

    motions.forEach(motion => {

        const { direction, units } = vector(motion)
        switch (direction) {

            case 'R':
                position.x += units;
                if (position.x > maxRight) maxRight = position.x
                break;

            case 'L':
                position.x -= units;
                if (position.x < maxLeft) maxLeft = position.x
                break;

            case 'U':
                position.y += units;
                if (position.y > maxUp) maxUp = position.y
                break;

            case 'D':
                position.y -= units;
                if (position.y < maxDown) maxDown = position.y
                break;

            default: throw Error('unknown direction')
        }
    })
    return { maxRight, maxLeft, maxUp, maxDown }
}




function calcGridSideLen(gridParams) {

    let max = 0
    for (const param in gridParams) {
        if (Math.abs(gridParams[param]) > max) {
            max = Math.abs(gridParams[param])
        }
    }
    return max * 2 + 1
}




function buildRope(knots) {

    let currentKnot = null

    const ropeKnot = {
        section: null,
        i: null,
        j: null,
        nextKnot: null
    }

    for (let knot = 0; knot < knots; knot++) {

        const thisKnot = { ...ropeKnot }
        if (knot === 0) {
            thisKnot.section = knot,
                thisKnot.i = Math.floor(grid.length / 2)
            thisKnot.j = Math.floor(grid[0].length / 2)
            headKnot = thisKnot
            currentKnot = headKnot
        } else {
            thisKnot.section = knot
            thisKnot.i = headKnot.i
            thisKnot.j = headKnot.j
            currentKnot.nextKnot = thisKnot
            currentKnot = thisKnot
        }

        if (knot === knots - 1) {
            grid[currentKnot.i][currentKnot.j] = true
        }
    }
}




function vector(motion) {

    const direction = motion.charAt(0)
    const units = Number(motion.match(/\d+/))
    return { direction, units }
}



// parse motions and move knots accordingly
function parseMotions(motions, grid, headKnot) {

    motions.forEach(motion => {
        const { direction, units } = vector(motion)
        moveRope(direction, units, grid, headKnot)
    })
}




function moveRope(direction, units, grid, headKnot) {

    for (let unit = 0; unit < units; unit++) {

        switch (direction) {
            case 'R':
                headKnot.j++
                moveKnots(headKnot, grid)
                break
            case 'L':
                headKnot.j--
                moveKnots(headKnot, grid)
                break
            case 'U':
                headKnot.i--
                moveKnots(headKnot, grid)
                break
            case 'D':
                headKnot.i++
                moveKnots(headKnot, grid)
                break
            default: throw Error('unknown direction');
        }

        try {
            indexOutOfBounds(headKnot, grid)
        } catch (err) {
            console.error({ message: err.message, head: headKnot, gridLen: grid.length })
        }
    }
}




function moveKnots(currentKnot, grid) {

    while (currentKnot.nextKnot !== null) {

        const iDistance = currentKnot.i - currentKnot.nextKnot.i
        const jDistance = currentKnot.j - currentKnot.nextKnot.j
        if (Math.abs(iDistance) > 1 && (currentKnot.j === currentKnot.nextKnot.j)) {
            currentKnot.nextKnot.i += iDistance + -Math.sign(iDistance)
        } else if (Math.abs(jDistance) > 1 && (currentKnot.i === currentKnot.nextKnot.i)) {
            currentKnot.nextKnot.j += jDistance + -Math.sign(jDistance)
        } else if (isDisplacementTwoDiagonal(currentKnot)) {
            newNextKnotPosition(currentKnot)
        }

        if (currentKnot.nextKnot.nextKnot === null) {
            grid[currentKnot.nextKnot.i][currentKnot.nextKnot.j] = true
        }

        currentKnot = currentKnot.nextKnot
    }
}




function isDisplacementTwoDiagonal(currentKnot) {

    const iIsTwoOff = Math.abs(currentKnot.i - currentKnot.nextKnot.i) === 2
    const jIsTwoOff = Math.abs(currentKnot.j - currentKnot.nextKnot.j) === 2
    return iIsTwoOff || jIsTwoOff
}




function newNextKnotPosition(currentKnot) {

    const iSign = Math.sign(currentKnot.i - currentKnot.nextKnot.i)
    const jSign = Math.sign(currentKnot.j - currentKnot.nextKnot.j)
    if (jSign === 1 && iSign === 1) {
        currentKnot.nextKnot.i = currentKnot.nextKnot.i + 1
        currentKnot.nextKnot.j = currentKnot.nextKnot.j + 1
    } else if (jSign === -1 && iSign === 1) {
        currentKnot.nextKnot.i = currentKnot.nextKnot.i + 1
        currentKnot.nextKnot.j = currentKnot.nextKnot.j - 1
    } else if (jSign === -1 && iSign === -1) {
        currentKnot.nextKnot.i = currentKnot.nextKnot.i - 1
        currentKnot.nextKnot.j = currentKnot.nextKnot.j - 1
    } else if (jSign === 1 && iSign === -1) {
        currentKnot.nextKnot.i = currentKnot.nextKnot.i - 1
        currentKnot.nextKnot.j = currentKnot.nextKnot.j + 1
    }
}




function indexOutOfBounds(headPosition, grid) {

    if (headPosition.i > grid.length - 1 || headPosition.i < 0) {
        throw Error('array index out of bounds')
    }
    if (headPosition.j > grid[headPosition.i].length - 1 || headPosition.j < 0) {
        throw Error('array index out of bounds')
    }
}



// prints grid values as '#' for true and '.' for false
function printGridVals() {
    let strGrid = ''
    for (let i = 0; i < grid.length; i++) {

        for (let j = 0; j < grid[0].length; j++) {

            if (grid[i][j]) {
                strGrid += '#'
            } else {
                strGrid += '.'
            }

        }
        strGrid += '\n'
    }
    console.log(strGrid)
}



// prints grid state with each knot represented as section value (0-9)
function printGridState(headKnot, grid) {

    let strGrid = ''
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {

            let currentKnot = headKnot
            let currentChar = '.'
            while (currentKnot !== null) {

                if (currentKnot.i === i && currentKnot.j === j) {
                    currentChar = currentKnot.section
                    break
                }
                currentKnot = currentKnot.nextKnot
            }
            strGrid += currentChar

        }
        strGrid += '\n'
    }
    console.log(strGrid)
}




function truthCounts(grid) {

    let count = 0
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j]) {
                count++
            }
        }
    }
    return count
}
