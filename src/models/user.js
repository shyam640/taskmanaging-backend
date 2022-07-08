const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema(
   {
      name : {
         type : String,
         required : true,
         trim : true
      },
      email : {
         type : String,
         unique : true,
         index : true,
         required : true,
         trim : true,
         lowercase : true,
         validate(value){
            if(!validator.isEmail(value)){
               throw new Error('Please provide correct Email!');
            }
         }
      },
      password : {
         type : String,
         required : true,
         trim : true,
         minlength : 8,
         validate(value){
            if(value.toLowerCase().includes('password')){
               throw new Error('password cannot be "password"');
            }
         }
      },
      age : {
         type : Number,
         default : 1,
         validate(value){
            if(value<=0){
               throw new Error('Please provide age greater then 0 !');
            }
         }
      },
      tokens : [{
         token : {
            type : String,
            required : true
         }
      }],
      avatar : {
         type : Buffer
      }
   },
   {
      timestamps : true
   }
);

userSchema.virtual('tasks',{
   ref : 'Task',
   localField : '_id',
   foreignField : 'owner'
});

userSchema.methods.toJSON = async function(){
   const user = this;
   const userObject = user.toObject();
   delete userObject.password;
   delete userObject.tokens;
   delete userObject.avatar;
   return userObject;
}

// methods allows one to use custom function on instances sometimes they are called instance function.
userSchema.methods.generateAuthToken = async function() {
   const user = this;
   const token = jwt.sign({ _id : user._id.toString() },process.env.JWT_SECRET_CODE);
   user.tokens = user.tokens.concat({token}); 
   await user.save();
   return token;
}

// statics allows one to use custom function on models sometimes they are called model function
userSchema.statics.findByCredentials = async (email,password) =>{
   const user = await User.findOne({email});
   if(!user){
      throw new Error('Unable to login!');
   }
   const isMatch = await bcrypt.compare(password,user.password);
   if(!isMatch){
      throw new Error('Unable to login!');
   }
   return user;
}


// Arrow function do not binds so using standard function
// password hashing for security purpose
userSchema.pre('save', async function (next){
   const user = this;
   if(user.isModified('password')){
      user.password = await bcrypt.hash(user.password,8);
   }
   next();
});

// Delete user's task as soon as user is removed
userSchema.pre('remove', async function (next ) {
   const user = this;
   await Task.deleteMany({ owner : user._id });
   next();
});

const User = mongoose.model('User',userSchema);

module.exports = User;