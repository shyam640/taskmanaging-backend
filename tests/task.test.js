const request = require('supertest');
const Task = require('../src/models/task');
const app = require('../src/app');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

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


test('Should create task for user', async () => {
   const response = await request(app)
                           .post('/task')
                           .set('Authorization',`Bearer ${oneUser.taokens[0].token}`)
                           .send({
                              description : 'From my tests'
                           })
                           .expect(201);
   const task = await Task.findById(response.body._id);
   expect(task).not.toBeNull();
   expect(task.completed).toEqual(false);
});


