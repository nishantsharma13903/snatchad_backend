const mongoose = require('mongoose');

const drugSchema = new mongoose.Schema({
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

const drugModel = mongoose.model("Drug", drugSchema);

module.exports = drugModel;