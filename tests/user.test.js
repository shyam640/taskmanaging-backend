const request = require('supertest');
const app = require('../src/app');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../src/models/user');

const oneUserId = new mongoose.Types.ObjectId();
const oneUser = {
   _id: oneUserId,
   name:'Ayushi',
   email:'Ayushi@gmail.com',
   password:'oiurfjo@(',
   age : 18,
   tokens: [{
      token : jwt.sign({ _id : oneUserId } , process.env.JWT_SECRET_CODE)
   }]
}

beforeEach(async () => {
   await User.deleteMany();
   await new User(oneUser).save();
})

test('Should Sign up a user', async () => {
   const response = await request(app).post('/users').send({
      name:'shyam',
      email:'shyam640@gmail.com',
      password:'8817719155'
   }).expect(201);

   const user = await User.findById(response.body.user._id);
   expect(user).not.toBeNull();

   expect(response.body).toMatchObject({
      user : {
         name:'shyam',
         email:'shyam640@gmail.com'
      },
      token : user.tokens[0].token
   });
});

test('Should login existing user', async () => {
   await request(app).post('/users/login').send({
      email : oneUser.email,
      password : oneUser.password
   }).expect(200);
});

test('Should get profile of user' , async () => {
   await request(app)
         .get('/users/me')
         .set('Authorization',`Bearer ${oneUser.tokens[0].token}`)
         .send()
         .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
   await request(app)
         .get('/users/me')
         .send()
         .expect(401);
});

test('Should delete account for user', async () => {
   await request(app)
         .delete('/users/me')
         .set('Authorization',`Bearer ${oneUser.tokens[0].token}`)
         .send()
         .expect(200);
});

test('Should not delete account for unauthenticated user', async () => {
   await request(app)
         .delete('/users/me')
         .send()
         .expect(401);
});

test('Should upload avatar image', async () => {
   await request(app)
         .post('/users/me/avatar')
         .set('Authorization',`Bearer ${oneUser.tokens[0].token}`)
         .attach('avatar','tests/fixtures/HacPlayer.png')
         .expect(200);
   const user = await User.findById(oneUserId);
   expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user field', async () => {
   await request(app)
         .patch('/users/me')
         .set('Authorization',`Bearer ${oneUser.tokens[0].token}`)
         .send({
            name : 'passed'
         })
         .expect(200);
   const user = await User.findById(oneUserId);
   expect(user.name).toEqual('passed');
});