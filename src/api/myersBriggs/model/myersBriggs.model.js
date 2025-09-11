const mongoose = require('mongoose');

const myersBriggsSchema = new mongoose.Schema({
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

const myersBriggsModel = mongoose.model("MyersBriggs", myersBriggsSchema);

module.exports = myersBriggsModel;