const mongoose = require('mongoose');

const thcSchema = new mongoose.Schema({
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

const thcModel = mongoose.model("THC", thcSchema);

module.exports = thcModel;