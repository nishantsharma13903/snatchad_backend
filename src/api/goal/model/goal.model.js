const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
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

const goalModel = mongoose.model("Goal", goalSchema);

module.exports = goalModel;