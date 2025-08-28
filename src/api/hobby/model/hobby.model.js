const mongoose = require('mongoose');

const hobbySchema = new mongoose.Schema({
    name  : {
        type : String,
        default : ""
    },
    icon : {
        type : String,
        default : ""
    },
    status : { 
        type : String,
        enum : ["Active", "Delete"],
        default : "Active"
    }
},{timestamps : true});

const hobbyModel = mongoose.model("Hobby", hobbySchema);

module.exports = hobbyModel;