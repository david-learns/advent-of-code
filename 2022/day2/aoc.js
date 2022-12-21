/**
 * Advent of Code 2022
 * 
 * https://adventofcode.com/2022/day/2
 * 
 */
'use strict';

// pass in truthy command line arg to run test file
const test = process.argv[2] || false

day2p1()
day2p2()

function day2p1() {
    const fs = require('fs')

    const testInput = 'strategy-guide_t.txt'
    const input = 'strategy-guide.txt'

    const contents = fs.readFileSync(test ? testInput : input,'utf-8')
    const guide = contents.split('\r\n')
    console.log(guide)

    const scoreing = {
        X: 1, // rock A
        Y: 2, // paper B
        Z: 3, // scissors C
        loss: 0,
        draw: 3,
        win: 6
    }
    let totalScore = tallyScore()

    console.log('totalScore part1:', totalScore)

    function tallyScore() {
        let score = 0
        guide.forEach(e => {
            const p1 = e.charAt(0)
            const p2 = e.charAt(2)
            const outcome = winner(p1, p2)
            score += scoreing[p2]
            score += scoreing[outcome]
        })
        return score
    }

    function winner(p1, p2) {
        if (
            p1 === 'A' && p2 === 'X' ||
            p1 === 'B' && p2 === 'Y' ||
            p1 === 'C' && p2 === 'Z'
            ) {
            return 'draw'
        } else if (
            p1 === 'A' && p2 === 'Y' || //rock paper win for me
            p1 === 'B' && p2 === 'Z' || //paper scissors win for me
            p1 === 'C' && p2 === 'X'    //scissors rock win for me
            ) {
            return 'win'
        } else {
            return 'loss'
        }
    }
}

function day2p2() {
    const fs = require('fs')

    const testInput = 'strategy-guide_t.txt'
    const input = 'strategy-guide.txt'

    const contents = fs.readFileSync(test ? testInput : input,'utf-8')
    const guide = contents.split('\r\n')

    const scoreing = {
        rock: 1,
        paper: 2,
        scissors: 3,
        X: 0,
        Y: 3,
        Z: 6
    }

    const play = {
        X: {
            A: 'scissors',
            B: 'rock',
            C: 'paper'
        },
        Y: {
            A: 'rock',
            B: 'paper',
            C: 'scissors'
        },
        Z: {
            A: 'paper',
            B: 'scissors',
            C: 'rock'
        },
    }

    function tallyScore() {
        let score = 0
        guide.forEach(e => {
            const p1 = e.charAt(0)
            const outcome = e.charAt(2)
            const p2 = play[outcome][p1]
            score += scoreing[p2]
            score += scoreing[outcome]
        })
        return score
    }

    const totalScore = tallyScore()
    console.log('total score part 2:',totalScore)

}
