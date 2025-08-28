const mongoose = require('mongoose');

const genderSchema = new mongoose.Schema({
    name  : {
        type : String,
        default : ""
    },
    status : { 
        type : String,
        enum : ["Active", "Delete"],
        default : "Active"
    }
},{timestamps : true});

const genderModel = mongoose.model("Gender", genderSchema);

module.exports = genderModel;