const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const io = require('../socket');
const  Post = require('../models/post');
const user = require('../models/user');


exports.getPosts = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;
    try
    {
        const totalItems = await Post.find().countDocuments();
        const posts = await Post.find()
            .populate('creator')
            .sort({ createdAt: -1 })
            .skip((currentPage -1 ) * perPage)
            .limit(perPage);
            
            res.status(200).json({
                message: 'All Post fetched',
                posts: posts,
                totalItems: totalItems
            });
    }
    catch(error)  
    { 
        if(!err.statusCode){
            err.statusCode = 500;
        } 
        next(err);
    }
    
};


exports.createPost = async (req, res, next) => {
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
    let creator;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: image,
        creator: req.userId
    });
    try{
        await post.save();
        const user = await User.findById(req.userId);
        user.posts.push(post);
        const savedUser = await user.save();
        res.status(201).json({
            message: 'Post Created Successfully',
            post: post,
            creator: { _id: creator._id, name: user.name }
        });
        return savedUser;
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        } 
        next(err);
    }
    // post.save()
    // .then(result => {
    //     return User.findById(req.userId);
    // })
    // .then(user => {
    //     creator = user;
    //     user.posts.push(post);
    //     return user.save();
    // })
    // .then(result => {
    //     console.log(result);
    //     io.getIO().emit('posts', { 
    //         action: 'create', 
    //         post: { ...post._doc, creator: { _id: req.userId, name: user.name } } 
    //     });
    //     res.status(201).json({
    //         message: 'Post Created Successfully',
    //         post: post,
    //         creator: { _id: creator._id, name: creator.name }
    //     });
    // })
    // .catch(err => { 
    //     if(!err.statusCode){
    //         err.statusCode = 500;
    //     } 
    //     next(err);
    // });
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
    .populate('creator')
    .then(post => {
        if(!post){
            const error = new Error('Cound Not found post.');
            error.statusCode = 403;
            throw error;
        }
        if(post.creator._id.toString() !== req.userId)
        {
            const error = new Error('User not authorised.');
            error.statusCode = 404;
            throw error;
        }
        if(imageUrl != post.imageUrl)
        {
            clearImage(post.imageUrl);
        }
        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;
        return post.save();
    })
    .then(result => {
        io.getIO().emit('posts', { action: 'update', post: result });
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



exports.postDelete = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if(!post)
            {
                const error = new Error('Cound Not found post.');
                error.statusCode = 404;
                throw error;
            }
            if(post.creator.toString() !== req.userId)
            {
                const error = new Error('User not authorised.');
                error.statusCode = 404;
                throw error;
            }
            clearImage(post.imageUrl);
            return post.deleteOne({_id: postId})
        })
        .then(result => {
            return User.findById(req.userId);
        })
        .then(user => {
            user.posts.pull(postId)
            return user.save();
        })
        .then(result => {
            io.getIO().emit('posts', { action: 'delete', post: postId });
            res.status(200).json({
                message: 'Post Deleted Successfully'
            })
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

















const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, (err) => {
        if (err){
            throw (err);
        }
        
    });
};


