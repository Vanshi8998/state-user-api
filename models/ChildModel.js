const mongoose = require('mongoose')
const DistrictModel = require('./DistrictModel')


const ChildModel = mongoose.Schema({
    name : String,
    sex: String,
    date: { type: Date },
    father_name: String,
    mother_name: String,
    district_id: String,
    photo: String,
})

module.exports = mongoose.model('ChildModel', ChildModel)
