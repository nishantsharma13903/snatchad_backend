const mongoose = require('mongoose');

const heightSchema = new mongoose.Schema({
    heightInFoot  : {
        type : String,
        default : ""
    },
    heightInCm : {
        type : Number,
        default : 0
    },
    status : { 
        type : String,
        enum : ["Active", "Delete"],
        default : "Active"
    }
},{timestamps : true});

const heightModel = mongoose.model("Height", heightSchema);

module.exports = heightModel;