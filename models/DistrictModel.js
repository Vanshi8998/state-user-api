const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const StateModel = require('../models/StateModel')

const DistrictModel = new mongoose.Schema({
    state_id: String,
    district : String,
});

DistrictModel.plugin(uniqueValidator);
module.exports = mongoose.model('DistrictModel', DistrictModel);