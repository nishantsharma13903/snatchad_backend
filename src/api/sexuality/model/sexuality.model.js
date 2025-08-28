const mongoose = require('mongoose');

const sexualitySchema = new mongoose.Schema({
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

const sexualityModel = mongoose.model("Sexuality", sexualitySchema);

module.exports = sexualityModel;