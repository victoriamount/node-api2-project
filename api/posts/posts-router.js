const express = require('express')
const Post = require('/Users/victoriamount/Documents/git/lambdaSchool/lambdaProjects/m4w1/node-api2-project/data/db.js')

const router = express.Router()

// GET ALL 
router.get('/', (req, res) => {
    Post.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            console.log('get all error', err.message)
            res.status(500).json({ error: "The posts information could not be retrieved." })
        })
})

// GET BY ID
router.get('/:id', (req, res) => {
    const { id } = req.params
    Post.findById(id)
        .then(post => {
            if (post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            console.log('get by id error', err.message)
            res.status(500).json({ error: "The post information could not be retrieved." })
        })
})

// GET COMMENTS FROM POST(ing) BY ID
router.get('/:id/comments', (req, res) => {
    const { id } = req.params
    Post.findPostComments(id)
        .then(comments => {
            if (comments) {
                res.status(200).json(comments)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            console.log('get comments error', err.message)
            res.status(500).json({ error: "The comments information could not be retrieved." })
        })
})

// POST NEW POST(ing)
router.post('/', (req, res) => {
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
    Post.insert(req.body)
        .then(response => {
            Post.findById(response.id)
                .then(post => {
                    if (post) {
                        res.status(200).json(post)
                    } else {
                        res.status(404).json({ message: "The post with the specified ID does not exist." })
                    }
                })
                .catch(err => {
                    console.log('get by id error', err.message)
                    res.status(500).json({ error: "The post information could not be retrieved." })
                })         
        })
        .catch(err => {
            console.log('post error', err.message)
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        })
})

// POST NEW COMMENT ON POST(ing) BY ID
router.post('/:id/comments', (req, res) => {
    if (!req.body.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    }    
    const { id } = req.params
    Post.findById(id)
        .then(post => {
            if (post) {
                Post.insertComment(req.body)
                    .then(post => {
                        Post.findCommentById(post.id)
                            .then(response => {
                                res.status(201).json(response)
                            })
                            .catch(err => {
                                res.status(500).json({ error: "There was an error while saving the comment to the database" })
                            })

                    })
                    .catch(err => {
                        res.status(500).json({ error: "There was an error while saving the comment to the database" })
                    })
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500).json({ error: "There was an error while saving the comment to the database" })
        })
})


// DELETE POST(ing) BY ID
router.delete('/:id', (req,res) => {
    const { id } = req.params
    let postToDelete = {}
    Post.findById(id)
        .then(post => {
            if (post) {
                postToDelete = post
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The post information could not be retrieved." })
        })
    
    Post.remove(id)
        .then(numDeleted => {
            if (numDeleted > 0) {
                res.status(200).json(postToDelete)
            } else {
                console.log('in the else')
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            console.log(err.message)
            res.status(500).json({ error: "The post could not be removed" })
        })
})

// EDIT POST(ing) BY ID
router.put('/:id', (req, res) => {
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
    const changes = req.body
    const { id } = req.params

    Post.update(id, changes) 
        .then(numChanged => {
            if (numChanged > 0) {
                Post.findById(id)
                    .then(post => {
                        if (post) {
                            res.status(200).json(post)                            
                        } else {
                            res.status(404).json({ message: "The post with the specified ID does not exist." })
                        }
                    })
                    .catch(err => {
                        res.status(500).json({ error: "The post information could not be retrieved." })
                    })

            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The post information could not be modified." })
        })
})


module.exports = router