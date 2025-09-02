const mongoose = require('mongoose');

const relationshipGoalSchema = new mongoose.Schema({
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

const relationshipGoalModel = mongoose.model("RelationshipGoal", relationshipGoalSchema);

module.exports = relationshipGoalModel;