const mongoose = require('mongoose');

const dateIdeaSchema = new mongoose.Schema({
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

const dateIdeaModel = mongoose.model("DateIdea", dateIdeaSchema);

module.exports = dateIdeaModel;