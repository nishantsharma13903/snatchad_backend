const mongoose = require('mongoose');

const smokingSchema = new mongoose.Schema({
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

const smokingModel = mongoose.model("Smoking", smokingSchema);

module.exports = smokingModel;