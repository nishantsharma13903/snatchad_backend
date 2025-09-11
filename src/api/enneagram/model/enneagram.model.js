const mongoose = require('mongoose');

const enneagramSchema = new mongoose.Schema({
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

const enneagramModel = mongoose.model("Enneagram", enneagramSchema);

module.exports = enneagramModel;