const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');
const User = require('../models/user');
const AuthController = require('../controllers/authController');

// describe('Auth Contoller - Login', function(){
//     before(function(done) {
//         mongoose.connect('mongodb+srv://ravipateljigneshpatel137:Ravi3601@nodeshop.azir75m.mongodb.net/Test-Messages')
//         .then(result => {
//             const user = new User({
//                 email: 'test@test.com',
//                 password: 'tester',
//                 name: 'test',
//                 posts: [],
//                 _id: '64a687f385c9e13736f10f7d'
//             });
//             return user.save();
//         })
//         .then(() => {
//             done();
//         });
//     });

//     beforeEach(function() {});
    
//     afterEach(function() {});

//     it('should throw an error with code 500 if accessing the database fails', function(){
//         sinon.stub(User, 'findOne');
//         User.findOne.throws();

//         expect(AuthController.login)

//         User.findOne.restore();
//     });


//     it('should send a response with a valid user status for an existing user', function(done){

//         const req = { userId: '64a687f385c9e13736f10f7d'};
//         const res = { 
//             statusCode: 500,
//             userStatus: null,
//             status: function(code) {
//                 this.statusCode = code;
//                 return this;
//             },
//             json: function(data){
//                 this.userStatus = data.status;
//             }
//         };
//         AuthController.getUserStatus(req, res, () => {}).then(() => {
//             expect(res.statusCode).to.be.equal(200);
//             expect(res.userStatus).to.be.equal('New User');
//             done();

//         });
//     });

//     after(function(done) {
//         User.deleteMany({})
//         .then(() => {
//             return mongoose.disconnect();
//         })
//         .then(() => {
//             done();
//         });
//     })

// });

