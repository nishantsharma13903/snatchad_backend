const mongoose = require('mongoose');

const alcoholSchema = new mongoose.Schema({
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

const alcoholModel = mongoose.model("Alcohol", alcoholSchema);

module.exports = alcoholModel;