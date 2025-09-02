const mongoose = require('mongoose');

const drinkingSchema = new mongoose.Schema({
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

const drinkingModel = mongoose.model("Drinking", drinkingSchema);

module.exports = drinkingModel;