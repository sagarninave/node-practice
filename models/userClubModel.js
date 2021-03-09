const mongoose = require('mongoose');

const userClubSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  club: {type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true}
});

module.exports = mongoose.model("UserClub", userClubSchema);