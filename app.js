const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const userRoute = require('./routes/user');
const clubRoute = require('./routes/club');
const userClubRoute = require('./routes/user-club');

let mongoDBURL = "mongodb://127.0.0.1:27017/nodepractice";
let mongoDBParams = {useNewUrlParser: true, useUnifiedTopology: true};
// mongoose.connect(mongoDBURL, mongoDBParams);
mongoose.connect("mongodb+srv://adminuser:adminpassword@cluster0.wzs7f.mongodb.net/Cluster0?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true  } );

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/users', userRoute);
app.use('/clubs', clubRoute);
app.use('/userclubs', userClubRoute);

app.use((req, res, next) => {
  const error = new Error('Invalid endpoint');
  error.status = 404;
  next(error);
})

app.use((error, req, res, next) => {
  let errorResponse = {
    status: 'failed',
    message: error.message
  };
  res.status(error.status || 500).json({error:errorResponse});
});

module.exports = app;