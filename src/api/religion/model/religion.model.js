const mongoose = require('mongoose');

const religionSchema = new mongoose.Schema({
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

const religionModel = mongoose.model("Religion", religionSchema);

module.exports = religionModel;