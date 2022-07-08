const express = require('express');
require('./db/mongoose');
const userRouter = require('../src/routers/user');
const taskRouter = require('../src/routers/task')

const app = express();

const multer = require('multer');
const upload = multer({
   dest : 'images',
   limits : {
      fileSize : 1000000
   },
   fileFilter(req, file, cb){
      if(!file.originalname.match(/\.(doc|docx|pdf)$/)){
         return cb(new Error('File type not supported'));
      }
      cb(undefined,true);
   }
});

app.post('/upload', upload.single('upload'), (req,res) => {
   res.send();
},(error,req,res,next) =>{
   res.status(400).send({error : error.message});
});

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;

// app.use((req,res,next) => {
//    if(req.method === 'GET'){
//       res.send('Get method is disabled!');
//    }else{
//       next();
//    }
// });

// app.use((req,res,next) => {
//    res.send(503).send('Site under maintainance! come back soon');
// });





// // Understanding the connection between models
// const User = require('./models/user');
// const Task = require('./models/task');

// const main = async () => {
//    const task = await Task.findById('60e874c34590a3221848f1d2');
//    await task.populate('owner').execPopulate();
//    console.log(task.owner);

//    const user = await User.findById('60e871de523d6b3a94545b0f');
//    await user.populate('userTasks').execPopulate();
//    console.log(user.userTasks);
// }
// main();