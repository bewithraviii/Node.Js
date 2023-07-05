const fs = require('fs');
const path = require('path');
const { validationResult, Result } = require('express-validator');
const post = require('../models/post');

const  Post = require('../models/post');


exports.getPosts = (req, res, next) => {
    Post.find()
    .then(posts => {
        res.status(200).json({
            message: 'All Post fetched',
            posts: posts
        })
    })
    .catch(err => { 
        if(!err.statusCode){
            err.statusCode = 500;
        } 
        next(err);
    })
    // res.status(200).json({
    //     posts: [{
    //         _id: '1',
    //         title: 'First Post',
    //         content: 'This is the first Post',
    //         imageUrl: 'images/duck.jpg',
    //         creator: {
    //             name: 'Maxximaili'
    //         },
    //         createdAt: new Date()
    //     }]
    // });
};


exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {   
        const error = new Error('Incorrect Details');
        error.statusCode = 422;
        throw error;
    }
    if(!req.file){
        const error = new Error('No image Provided');
        error.statusCode = 422;
        throw error;
    }

    const imageUrl = req.file.path;
    let image = imageUrl.replace('\\','/');
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: image,
        creator: {
            name: 'RaviPatel'
        },
    });
    post.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Post Created Successfully',
            post: result
        });
    })
    .catch(err => { 
        if(!err.statusCode){
            err.statusCode = 500;
        } 
        next(err);
    });
};




exports.fetchPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
    .then(post => {
        if(!post){
            const error = new Error('Cound Not found post.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Post fetched',
            post: post
        })
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};



exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {   
        const error = new Error('Incorrect Details');
        error.statusCode = 422;
        throw error;
    }
    if(req.file)
    {
        const imageis = req.file.path;
        let image = imageis.replace('\\','/');
        imageUrl = image;
    }
    if(!imageUrl){
        const error = new Error('No file is picked');
        error.statusCode = 422;
        throw error;
    }
    Post.findById(postId)
    .then(post => {
        if(!post){
            const error = new Error('Cound Not found post.');
            error.statusCode = 404;
            throw error;
        }
        // if(imageUrl != post.imageUrl)
        // {
        //     clearImage(post.imageUrl);
        // }
        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;
        return post.save();
    })
    .then(result => {
        res.status(200).json({
            message: 'Post Updated',
            post: result
        });
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};


const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};