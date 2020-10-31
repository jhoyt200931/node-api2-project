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
    const id = null;
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

router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.findById(id)
        .then(post => {
            res.status(200).json(post);
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

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    if(validatePost(changes)){
        db.update(id, changes)
            .then(post => {
                if(post > 0){
                    res.status(200).json(post);
                } else{
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                }
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({ error: "The post information could not be modified." })
            })
    } else {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }

})

router.post('/:id/comments', (req, res) => {
    const { id } = req.params;
    const comment = req.body;
    let postId = null;
    function validateComment(param) {
        if(!param.text){
            return false
        } else {
            return true
        }
    }

    if(validateComment(comment)) {
        db.findById(id)
            .then(post => {
                console.log(post);
                postId = post[0].id;
                if(postId){
                    db.insertComment(comment)
                                .then(newComment => {
                                    res.status(201).json(newComment);
                                })
                                .catch(error => {
                                    console.log(error);
                                    res.status(500).json({ error: "There was an error while saving the comment to the database" })
                                })
                } else {
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                }
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({ error: "There was an error while saving the post to the database" })
            })
    } else {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    }
})

router.get('/:id/comments', (req, res) => {
    const { id } = req.params;
    let postId = null;

    db.findById(id)
            .then(post => {
                console.log(post);
                postId = post[0].id;
                if(postId){
                    db.findPostComments(postId)
                        .then(comments => {
                            res.status(200).json(comments)
                        })
                        .catch(error => {
                            console.log(error);
                            res.status(500).json({ error: "The comments information could not be retrieved." })
                        })
                } else {
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                }
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({ error: "The comments information could not be retrieved." })
            })
})

module.exports = router;