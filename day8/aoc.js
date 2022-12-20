/**
 * Advent of Code 2022
 * 
 * https://adventofcode.com/2022/day/8
 * 
 */
'use strict';


const test = process.argv[2] || false
const input = test ? 'tree-grid_t.txt' : 'tree-grid.txt'

const fs = require('fs')
const contents = fs.readFileSync(input, 'utf-8')
const gridRows = contents.split('\r\n')
const treeGrid = []

gridRows.forEach(row => {
    treeGrid.push(row.split(''))
})

// console.log(treeGrid)

let visibleTrees = gridRows.length * 2 + gridRows[0].length * 2 - 4

// count visible trees
for (let i = 1; i < treeGrid.length - 1; i++) {
    for (let j = 1; j < treeGrid[0].length - 1; j++) {

        if (visibleLeft(i, j, treeGrid) || visibleRight(i, j, treeGrid) || visibleUp(i, j, treeGrid) || visibleDown(i, j, treeGrid)) {
            // console.log(`visible, i: ${i}, j: ${j}`)
            visibleTrees++
        }
    }
}

console.log('visible trees:', visibleTrees)

function visibleLeft(i, j, grid) {
    if (grid[i][j] === 0) return false
    for (let k = j - 1; k >= 0; k--) {
        if (grid[i][j] <= grid[i][k]) {
            // console.log(`visibleLeft: false k:${k}, i:${i}, j:${j}`)
            return false
        }
    }
    return true
}

function visibleRight(i, j, grid) {
    if (grid[i][j] === 0) return false
    for (let k = j + 1; k < grid[j].length; k++) {
        if (grid[i][j] <= grid[i][k]) {
            // console.log(`visibleRight false k:${k}, i:${i}, j:${j}`)
            return false
        }
    }
    return true
}

function visibleUp(i, j, grid) {
    if (grid[i][j] === 0) return false
    for (let k = i - 1; k >= 0; k--) {
        if (grid[i][j] <= grid[k][j]) {
            // console.log(`visibleUp false k:${k}, i:${i}, j:${j}`)
            return false
        }
    }
    return true
}

function visibleDown(i, j, grid) {
    if (grid[i][j] === 0) return false
    for (let k = i + 1; k < grid[i].length; k++) {
        if (grid[i][j] <= grid[k][j]) {
            // console.log(`visibleDown false k:${k}, i:${i}, j:${j}`)
            return false
        }
    }
    return true
}

let maxScenicScore = 0

for (let i = 0; i < treeGrid.length; i++) {
    for (let j = 0; j < treeGrid[0].length; j++) {
        let scenicScore = 1

        // get scenic score each direction
        scenicScore *= getScenicScoreLeft(i, j, treeGrid)
        scenicScore *= getScenicScoreRight(i, j, treeGrid)
        scenicScore *= getScenicScoreUp(i, j, treeGrid)
        scenicScore *= getScenicScoreDown(i, j, treeGrid)

        if (scenicScore > maxScenicScore) {
            maxScenicScore = scenicScore
        }
    }
}

console.log('maximum scenic score:', maxScenicScore)

function getScenicScoreLeft(i, j, grid) {
    let score = 0
    for (let k = j - 1; k >= 0; k--) {
        if (grid[i][j] > grid[i][k]) {
            score++
        } else if (grid[i][j] <= grid[i][k]) {
            score++
            break
        }
    }
    // console.log(`left, grid[${i}][${j}], score: ${score}`)
    return score
}

function getScenicScoreRight(i, j, grid) {
    let score = 0
    for (let k = j + 1; k < grid[i].length; k++) {
        if (grid[i][j] > grid[i][k]) {
            score++
        } else if (grid[i][j] <= grid[i][k]) {
            score++
            break
        }
    }
    // console.log(`right, grid[${i}][${j}], score: ${score}`)
    return score
}

function getScenicScoreUp(i, j, grid) {
    let score = 0
    for (let k = i - 1; k >= 0; k--) {
        if (grid[i][j] > grid[k][j]) {
            score++
        } else if (grid[i][j] <= grid[k][j]) {
            score++
            break
        }
    }
    // console.log(`up, grid[${i}][${j}], score: ${score}`)
    return score
}

function getScenicScoreDown(i, j, grid) {
    let score = 0
    for (let k = i + 1; k < grid[i].length; k++) {
        if (grid[i][j] > grid[k][j]) {
            score++
        } else if (grid[i][j] <= grid[k][j]) {
            score++
            break
        }
    }
    // console.log(`down, grid[${i}][${j}], score: ${score}`)
    return score
}


