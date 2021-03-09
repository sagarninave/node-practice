const mongoose = require('mongoose');

const clubSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {type: String, required: true},
  type: {type: String, required: true},
  description: {type: String, required: true},
  membersheep_fees: {type: Number, required: true},
});

module.exports = mongoose.model("Club", clubSchema);