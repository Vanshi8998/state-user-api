const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const StateModel = new mongoose.Schema({
    state :String,
});

StateModel.plugin(uniqueValidator);
module.exports = mongoose.model('StateModel', StateModel);