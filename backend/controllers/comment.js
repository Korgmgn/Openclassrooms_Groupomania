const jwt = require('jsonwebtoken');
const fs = require('fs');
const { sequelize, user, post, comment } = require('../models/index');

//const user = user.findOne({})
    //.then(user => xx).resolve(user => user).catch()

exports.createComment = (req, res, next) => {
    user.findOne({ where: { uuid: req.body.userUuid }})
        .then((user) => {
            post.findOne({ where: { uuid: req.params.postuuid }})
            .then((post) => {
                const newComment = { content: req.body.content, userId: user.id, postId: post.id };
                console.log(newComment)
                
                comment.create(newComment)
                    .then((newComment) => res.json(newComment))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(400).json({ error }));
}

exports.modifyComment = (req, res, next) => {
    comment.findOne({ where: { uuid: req.params.uuid }, include: user})
        .then((comment) => {
            if(req.params.uuid == comment.user.uuid){
                comment.content = req.body.content
                comment.save()
                    .then(() => res.status(200).json({ message: 'Message modifié !'}))
                    .catch(error => res.status(400).json({ error }));
            } else {
                res.status(403).json({ message: 'Unauthorized request !' })
            }
        })
        .catch(error => res.status(400).json({ error }));

}

exports.deleteComment = (req, res, next) => {
    comment.findOne({ where: { uuid: req.params.uuid }, include: user})
        .then((comment) => {
            if(req.params.uuid == comment.user.uuid){
                comment.destroy()
                    .then(() => res.status(200).json({ message: 'Message supprimé !'}))
                    .catch(error => res.status(400).json({ error }));
            } else {
                res.status(403).json({ message: 'Unauthorized request !' })
            }
        })
        .catch(error => res.status(400).json({ error }));
}
/* 
exports.allComments = (req, res, next) => {
    post.findOne({ where: { uuid: req.params.uuid }}) //include comments
        .then((post) => res.json(post))
        .catch(error => res.status(400).json({ error }));
}
 */