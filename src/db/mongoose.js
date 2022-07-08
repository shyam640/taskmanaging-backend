// Mongoose provides a straight-forward, schema-based solution to model your application data. It includes built-in type casting, validation, query building, business logic hooks and more, out of the box
// In simple words, Mongoose acts as an intermediate between mongodb and server side language(like NodeJs)

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL,{
   useNewUrlParser : true,
   useCreateIndex : true,
   useFindAndModify : false
});


// Below code is for learning purpose how data user is created
// const User = mongoose.model('User',{
//    name : {
//       type : String,
//       required : true,
//       trim : true
//    },
//    Email : {
//       type : String,
//       required : true,
//       trim : true,
//       lowercase : true,
//       validate(value){
//          if(!validator.isEmail(value)){
//             throw new Error('Please provide correct Email!');
//          }
//       }
//    },
//    password : {
//       type : String,
//       required : true,
//       trim : true,
//       minlength : 8,
//       validate(value){
//          if(value.toLowerCase().includes('password')){
//             throw new Error('password cannot be "password"');
//          }
//       }
//    },
//    age : {
//       type : Number,
//       default : 1,
//       validate(value){
//          if(value<=0){
//             throw new Error('Please provide age greater then 0 !');
//          }
//       }
//    }
// });

// const user = new User({
//    name : 'its_shyam640',
//    Email : 'shyamSundarVashISHtha@gmail.com',
//    password : 'phone8823@#9',
//    age : 18
// });

// user.save().then((result) => {
//    console.log(user);
// }).catch((error) => {
//    console.log(error);
// });

// // output
// // {
// //    _id: 60e5b254c0d77b0ddc19cdf0,
// //    name: 'its_shyam640',
// //    Email : 'shyamsundarvashishtha@gmail.com',
// //    password : 'phone8823@#9'
// //    age: 18,
// //    __v: 0                        //this is document version
// //  }



// const Task = mongoose.model('Task',{
//    description :{
//       type : String,
//       required : true,
//       trim : true,
//       minlength : 3
//    },
//    completed : {
//       type : Boolean,
//       default : false
//    }
// });

// const task = new Task({
//    description : 'Do something !',
//    completed : false,
// });

// task.save().then((result) => {
//    console.log(result);
// }).catch((error) => {
//    console.log(error);
// });