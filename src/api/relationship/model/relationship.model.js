const mongoose = require('mongoose');

const relationshipSchema = new mongoose.Schema({
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

const relationshipModel = mongoose.model("Relationship", relationshipSchema);

module.exports = relationshipModel;