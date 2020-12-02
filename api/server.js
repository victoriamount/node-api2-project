const express = require('express')
const cors = require('cors')
const server = express()

const postsRouter = require('./posts/posts-router')

server.use(cors())
server.use(express.json())
server.use('/api/posts', postsRouter)



// Base endpoint
server.get('/', (req, res) => {
    res.send(`<h2>The App. Pow!</h2>`)
})

module.exports = server