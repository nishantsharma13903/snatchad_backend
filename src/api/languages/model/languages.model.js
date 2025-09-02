const mongoose = require('mongoose');

const languagesSchema = new mongoose.Schema({
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

const languagesModel = mongoose.model("Languages", languagesSchema);

module.exports = languagesModel;