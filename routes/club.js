const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { response } = require('../app');
const Club = require('../models/clubModel');

router.get('/', (req, res, next) => {
  Club.find()
  .select('title type description membersheep_fees')
  .exec()
  .then(result => {
    if(result){
      let response = {
        status:"success",
        message:"data retrieved successfully",
        count: result.length,
        clubs: result
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
      error : error
    };
    res.status(500).json(errorResponse);
  });
});

router.get('/club/:clubId', (req, res, next) => {
  let clubId = req.params.clubId;
  Club.findById(clubId)
  .select('title type description membersheep_fees')
  .exec()
  .then(result => {
    if(result){
      let response = {
        status:"success",
        message:"data retrieved successfully",
        club : result
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
  });
});

router.post('/club', (req, res, next) => {

  const club = new Club({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    type: req.body.type,
    description: req.body.description,
    membersheep_fees: req.body.membersheep_fees
  });

  club.save()
  .then(result => {
    if(result){
      let response = {
        status:"success",
        message:"data saved successfully",
        club: club
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
});

router.put('/edit/:clubId', (req, res, next) => {

  let clubId = req.params.clubId;

  let dataObj = {};
  for(const item of req.body){
    dataObj[item.key] = item.value;
  }

  Club.findById(clubId)
  .exec()
  .then(result => {
    if(result._id){
      return Club.updateOne({_id:clubId}, {$set: dataObj})
    }
  })
  .then(result => {
    if(result){
      let response = {
        status:"success",
        message:"data updated successfully",
      };
      res.status(200).json(response)
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

router.delete('/delete/:clubId', (req, res, next) => {
  let clubId = req.params.clubId;
  Club.findById(clubId)
  .exec()
  .then(result => {
    if(result._id){
      return Club.remove({_id:clubId})
    }
  })
  .then(result => {
    if(result){
      let response = {
        status:"success",
        message:"data deleted successfully",
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

module.exports = router;