const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
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

const petModel = mongoose.model("Pet", petSchema);

module.exports = petModel;