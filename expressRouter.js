const express = require('express');
const router = express.Router();

const db = require('./data/db.js');

function validatePost(post) {
    if(!post.title) {
        return false
    } else if(!post.contents) {
        return false
    } else {
        return true
    }
}

router.post('/', (req, res) => {
    const post = req.body;

    if(validatePost(post)) {
        db.insert(post)
            .then(id => {
                db.findById(id)
                    .then(post =>{
                        console.log(post)
                        res.status(201).json(post)
                    })
                    .catch(error => {
                        console.log(error);
                        res.status(500).json({ error: "There was an error while saving the post to the database" })
                    })
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({ error: "There was an error while saving the post to the database" })
            })
    } else {
        res.status(400).json({  errorMessage: "Please provide title and contents for the post." })
    }
});

router.get('/', (req, res) => {
    db.find()
        .then(posts => {
            res.status(200).json(posts);
        });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.remove(id)
        .then(count => {
            if(count > 0) {
                res.status(200).json({ message: 'This post has been deleted' })
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "The post could not be removed" })
        })
})

module.exports = router;