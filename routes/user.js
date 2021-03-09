const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const { response } = require('../app');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
// const passwordHash = require('password-hash');

router.post('/login', (req, res, next) => {

  let userEmail = req.body.email;
  let userPassword = req.body.password;

  User.findOne({email: userEmail})
  .exec()
  .then(result => {
    if(result){
      let isAuthenticated = passwordHash.verify(userPassword, result.password);
      if(isAuthenticated){
        let user = {
          id:result._id,
          fname:result.fname,
          lname:result.lname,
          email:result.email,
        }
        let accessToken = jwt.sign(user,"access", {expiresIn:"1d"});
        let refreshToken = jwt.sign(user,"refresh", {expiresIn:"7d"});
        let response = {
          id: result._id,
          email: result.email,
          access_token: accessToken,
          refresh_token: refreshToken
        };
        res.status(200).json(response);
      }
    }
    else{
      let response = {
        status:"failed",
        message:"user does not exists",
      };
      res.status(200).json(response);
    }
  })
  .catch(error => {
    let errorResponse = {
      error: error
    };
    res.status(500).json(errorResponse);
  });
});

router.get('/', (req, res, next) => {
  User.find()
  .exec()
  .then(result => {
    if(result){
      let response = {
        status:"success",
        message:"users found",
        count: result.length,
        users: result.map(user => {
          return {
            _id: user._id,
            email: user.email,
            url: `http://localhost:8000/users/user/${user._id}` 
          }
        })
      };
      res.status(200).json(response);
    }
  })
  .catch(error => {
    let errorResponse = {
      error : error
    };
    res.status(500).json(errorResponse);
  })
});

router.get('/user/:userId', (req, res, next) => {
  let userId = req.params.userId;
  User.findById(userId)
  .exec()
  .then(result => {
    if(result){
      let response = {
        status:"success",
        message:"data retrieved successfully",
        user : result
      };
      res.status(200).json(response);
    }
    else{
      let response = {
        status:"success",
        message:"data not found"
      };
      res.status(200).json(response);
    }
  })
  .catch(error => {
    let errorResponse = {
      error: error
    };
    res.status(500).json(errorResponse);
  });
});

router.post('/user', (req, res, next) => {

  User.find({email:req.body.email})
  .exec()
  .then(result => {
    if(result.length >=1){
      return res.status(200).json({
        message:"user existed"
      })
    }
    else{
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: req.body.password
      });
    
      user.save()
      .then(result => {
        if(result){
          let response = {
            status:"success",
            message:"user registerd",
            user: user
          };
          res.status(201).json(response);
        }
      })
      .catch(error => {
        let errorResponse = {
          error: error
        };
        res.status(500).json(errorResponse); 
      });
    }
  })
});

router.put('/edit/:userId', (req, res, next) => {

  let userId = req.params.userId;

  let dataObj = {};
  for(const item of req.body){
    dataObj[item.key] = item.value;
  };

  User.findById(userId)
  .then(result => {
    if(result){
      return User.updateOne({_id:userId}, {$set: dataObj})
    }
  })
  .then(result => {
    if(result){
      let response = {
        status:"success",
        message:"data updated updated"
      };
      res.status(200).json(response);
    }
  })
  .catch(error => {
    let errorResponse = {
      status:"failed",
      message:"data not found"
    };
    res.status(200).json(errorResponse);
  });
});

router.delete('/delete/:userId', (req, res, next) => {
  let userId = req.params.userId;
  User.findById(userId)
  .exec()
  .then(result => {
    if(result._id){
      return User.remove({_id:userId})
    }
  })
  .then(result => {
    if(result){
      let response = {
        status:"success",
        message:"user deleted",
      };
      res.status(200).json(response);
    }
  })
  .catch(error => {
    let errorResponse = {
      status:"failed",
      message:"user does not exists"
    };
    res.status(200).json(errorResponse);
  });
});

module.exports = router;