const mongoose = require('mongoose');

const politicalStanceSchema = new mongoose.Schema({
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

const politicalStanceModel = mongoose.model("PoliticalStance", politicalStanceSchema);

module.exports = politicalStanceModel;