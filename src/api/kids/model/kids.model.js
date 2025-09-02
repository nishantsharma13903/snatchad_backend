const mongoose = require('mongoose');

const kidsSchema = new mongoose.Schema({
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

const kidsModel = mongoose.model("Kids", kidsSchema);

module.exports = kidsModel;