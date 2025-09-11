const mongoose = require('mongoose');

const pronounSchema = new mongoose.Schema({
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

const pronounModel = mongoose.model("Pronoun", pronounSchema);

module.exports = pronounModel;