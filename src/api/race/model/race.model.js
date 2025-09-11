const mongoose = require('mongoose');

const raceSchema = new mongoose.Schema({
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

const raceModel = mongoose.model("Race", raceSchema);

module.exports = raceModel;