module.exports = function(test) {
    
    const fs = require('fs')
    const http = require('http')
    
    const PORT = 8080
    
    const testInput = './cals-list_t.txt'
    const input = './cals-list.txt'
    
    
    const server = http.createServer((req, res) => {
        const data = fs.readFileSync(test ? testInput : input, 'utf-8')
        res.write(data)
        res.end()
    })
    
    server.listen(PORT, () => { console.log('serving input files on port', PORT)})
}