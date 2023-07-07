const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');
const user = require('../models/user');
const FeedController = require('../controllers/feedController');
 



describe('Feed Contoller', function(){
    before(function(done) {
        mongoose.connect('mongodb+srv://ravipateljigneshpatel137:Ravi3601@nodeshop.azir75m.mongodb.net/Test-Messages')
        .then(result => {
            const user = new User({
                email: 'test@test.com',
                password: 'tester',
                name: 'test',
                posts: [],
                _id: '64a687f385c9e13736f10f7d'
            });
            return user.save();
        })
        .then(() => {
            done();
        });
    });

    beforeEach(function() {});
    
    afterEach(function() {});

    it('should add a created post to the posts of the creator', function(done) {
        const req = {
            body: {
                title: 'Test Post',
                content: 'A Test Post'
            },
            file: {
                path: 'abc'
            },
            userId: '64a687f385c9e13736f10f7d'
        };

        const res = { status: function() {
            return this;
        }, json: function() {} };

        FeedController.createPost(req, res, () => {})
        .then((savedUser) => {
            expect(savedUser).to.have.property('posts');
            expect(savedUser.posts).to.have.length(1);  
            done();          
        })
        // .catch((error) => {
        //     done(error);
        // });
    })

    // after(function(done) {
    //     user.deleteMany({})
    //     .then(() => {
    //         return mongoose.disconnect();
    //     })
    //     .then(() => {
    //         done();
    //     });
    // })

});
