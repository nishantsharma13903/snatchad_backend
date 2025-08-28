const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
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

const interestModel = mongoose.model("Interest", interestSchema);

module.exports = interestModel;