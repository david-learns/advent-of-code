/**
 * Advent of Code 2022
 * 
 * https://adventofcode.com/2022/day/7
 * 
 */
'use strict';

// pass in truth command line arg to use test input
const test = process.argv[2] || false
const input = test ? './terminal_t.txt' : './terminal.txt'

const util = require('util')
const fs = require('fs')
const contents = fs.readFileSync(input, 'utf-8')
const terminalArr = contents.split('\r\n')

const inspectOptions = {
    colors: true,
    compact: false,
    depth: 5,
    breakLength: 60,
}

const SIZE_BOUND = 100000
const MIN_SPACE_NEEDED = 30000000
const TOTAL_DISK_SPACE = 70000000

let root = null
let currentDir = null
const dirsToRemove = new Map()

/**
 * 
 * example data structure:
 * {
 *   label: '/',
 *   parent: null
 *   totalSize: null,
 *   fileSizeArr: [221, 54004],
 *   a: {...},
 *   b: {...},
 *   c: {...},
 * }
 */
function Folder() {

    this.label = null;
    this.parent = null;
    this.totalSize = null;
    this.fileSizeArr = [];

}

// the following loop parses commands and builds out tree data structure
for (let i = 0; i < terminalArr.length; i++) {

    if (terminalArr[i].startsWith('$')) {

        if (terminalArr[i] !== '$ ls') {
            const arg = terminalArr[i].split(' ')[2]
            cd(arg)
        }

    } else {

        if (terminalArr[i].startsWith('dir')) {
            const label = terminalArr[i].split(' ')[1]
            currentDir[label] = null
        } else {
            const fileSize = terminalArr[i].split(' ')[0]
            currentDir.fileSizeArr.push(Number(fileSize))
        }
    }
}

setTotalSizeRecursively(root)
// console.log(util.inspect(root, inspectOptions))

const freeSpace = TOTAL_DISK_SPACE - root.totalSize
const minSpaceToDelete = MIN_SPACE_NEEDED - freeSpace
// console.log(`minimum space to delete: ${minSpaceToDelete}`)

const sum = getDirSizesUnderBound(root)
console.log('sum of dirs <= 100000:', sum)

/**
 * find smallest dir with size large enough to create enough free space for
 * update
 */
fillDirsToRemove(root)
const remove = removeDir()
console.log(`remove label: ${remove.dir}, size: ${remove.dirSize}`)

// performs cd (change directory) command
function cd(dir) {

    if (dir === '..') {

        currentDir = currentDir.parent

    } else {

        const folder = new Folder()
        folder.label = dir
        if (dir === '/') {
            root = folder
        } else {
            folder.parent = currentDir
            currentDir[dir] = folder
        }
        currentDir = folder
    }
}

function setTotalSizeRecursively(node) {

    const dirs = getDirs(node)
    // console.log(`current dir: ${node.label}, dirs: ${dirs}`)

    /**
     * if dirs.length is zero, set totalSize to sum of fileSizeArr
     * this is the end of the branch
     */
    if (dirs.length === 0) {
        node.totalSize = node.fileSizeArr.reduce((prev, curr) => prev + curr)
    }

    // visit each subfolder recursively
    dirs.forEach(dir => {
        setTotalSizeRecursively(node[dir])
    })

    /**
     * if this node isn't the root node, go up one level to parent. test
     * all child nodes for non-null totalSize property. if all parent
     * subfolders have totalSize set to non-null, set parent totalSize
     * property to sum of fileSizeArr contents and subfolder totalSize
     * properties
     */
    if (node.parent !== null) {

        if (allChildrenTotalSizeSet(node.parent)) {
            const parentFileSizeSum = node.parent.fileSizeArr.reduce((prev, curr) => prev + curr, 0)
            const childDirSizeSum = sumChildrenTotalSizes(node.parent)
            node.parent.totalSize = parentFileSizeSum + childDirSizeSum
        }
    }
}

// get subdirectories of this node
function getDirs(node) {
    try {

        const nonDirList = ['label', 'parent', 'totalSize', 'fileSizeArr']
        const properties = Object.keys(node)
        const dirs = []
        properties.forEach(e => {
            if (!nonDirList.includes(e)) {
                dirs.push(e)
            }
        })
        return dirs

    } catch (err) {
        console.log(`err: ${err.message},\nnode: ${util.inspect(node, inspectOptions)}`)
    }
}

// return true if all subdirectories have totalSize non-null
function allChildrenTotalSizeSet(node) {
    const dirs = getDirs(node)
    const setNodeTotalSize = dirs.every(dir => node[dir].totalSize !== null)
    // console.log(`all children size set: ${setNodeTotalSize}, this node is: ${node.label}`)
    return setNodeTotalSize
}

function sumChildrenTotalSizes(node) {
    const dirs = getDirs(node)
    let sum = 0
    dirs.forEach(dir => {
        sum += node[dir].totalSize
    })
    return sum
}

// sum all directory totalSizes not more than SIZE_BOUND
function getDirSizesUnderBound(node, sum = 0) {
    const dirs = getDirs(node)
    if (node.totalSize <= SIZE_BOUND) {
        sum += node.totalSize
    }
    dirs.forEach(dir => {
        sum = getDirSizesUnderBound(node[dir], sum)
    })
    return sum
}

/**
 * set potential directories to delete which contain greater than or equal
 * to min space needed
 */
function fillDirsToRemove(node) {
    const dirs = getDirs(node)
    if (node.totalSize >= minSpaceToDelete) {
        dirsToRemove.set(node.label, node.totalSize)
    }
    dirs.forEach(dir => {
        fillDirsToRemove(node[dir])
    })
}

function removeDir() {
    let dir = null
    let dirSize = Infinity
    dirsToRemove.forEach((size, label) => {
        if (dirSize > size) {
            dirSize = size
            dir = label
        }
    })
    return { dir, dirSize }
}
