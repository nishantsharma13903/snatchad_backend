const mongoose = require('mongoose');

const zodiacSignSchema = new mongoose.Schema({
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

const zodiacSignModel = mongoose.model("ZodiacSign", zodiacSignSchema);

module.exports = zodiacSignModel;