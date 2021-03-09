const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const userClub = require('../models/userClubModel');

router.get('/', (req, res, next) => {
  userClub.find()
  .exec()
  .then(result => {
    if(result){
      let response = {
        status:"success",
        message:"data retrieved successfully",
        count: result.length,
        user_clubs: result.map(item => {
          return {
            _id: item._id,
            user_request: `http://localhost:8000/users/user/${item.user}`,
            club_request: `http://localhost:8000/clubs/club/${item.club}`
          }
        })
      };
      res.status(200).json(response);
    }
    else{
      let response = {
        status:"success",
        message:"data not found",
      };
      res.status(200).json(response);
    }
  })
  .catch(error => {
    let errorResponse = {
      error: error
    };
    res.status(500).json(errorResponse);
  })
})

router.get('/user-club/:userClubId', (req, res, next) => {
  let userClubId = req.params.userClubId;
  userClub.findById(userClubId)
  .populate("user")
  .populate("club")
  .exec()
  .then(result => {
    if(result){
      let response = {
        status:"success",
        message:"data retrieved successfully",
        userClub : result
      };
      res.status(200).json(response);
    }
    else{
      let response = {
        status:"success",
        message:"data not found",
      };
      res.status(200).json(response);
    }
  })
  .catch(error => {
    let errorResponse = {
      error: error
    };
    res.status(500).json(errorResponse);
  })
})

router.post('/user-club', (req, res, next) => {

  const user_club = new userClub({
    _id: new mongoose.Types.ObjectId(),
    user: req.body.user_id,
    club: req.body.club_id
  });

  console.log(user_club)

  user_club
  .save()
  .then(result => {
    if(result){
      let response = {
        status:"success",
        message:"data saved successfully",
      };
      res.status(201).json(response);
    }
  })
  .catch(error => {
    let errorResponse = {
      error : error
    }
    res.status(500).json(errorResponse); 
  });
})


module.exports = router;