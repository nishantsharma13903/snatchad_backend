const logger = require("@/utils/logger/logger.utils");
const RelationshipGoal = require("../model/relationshipGoal.model");

exports.createRelationshipGoal = async (name) => {
  try {
    const newRelationshipGoal = new RelationshipGoal({ name });
    return await newRelationshipGoal.save();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getRelationshipGoalById = async (id) => {
  try {
    const relationshipGoal = await RelationshipGoal.findOne({ _id: id });
    return relationshipGoal;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getRelationshipGoalByName = async (name) => {
  try {
    const existingRelationshipGoal = await RelationshipGoal.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    return existingRelationshipGoal;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getAllRelationshipGoal = async (
  page = 1,
  limit = 10,
  selectedFields,
  search = ""
) => {
  try {
        page = Number.parseInt(page);
    limit = Number.parseInt(limit);
    const skip = (page - 1) * limit;

    const query = {
      status: "Active",
    };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const relationshipGoals = await RelationshipGoal.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .select(selectedFields)
      .lean();

    const totalRecords = await RelationshipGoal.countDocuments(query);

    return {
      data: relationshipGoals,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    };
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.updateRelationshipGoalById = async (id, payload) => {
  try {
    const updatedRelationshipGoal = await RelationshipGoal.findByIdAndUpdate(id, {
      $set: payload,
    });
    return updatedRelationshipGoal;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.checkRelationshipGoalExistance = async (name) => {
  try {
    const isExist = await RelationshipGoal.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.checkRelationshipGoalExistanceForUpdate = async (name, id) => {
  try {
    const isExist = await RelationshipGoal.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i")}, _id: { $ne: id }, status : "Active", // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.deleteRelationshipGoalByName = async (name, id) => {
  try {
    return await RelationshipGoal.deleteMany({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      status: "Delete",
    });
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};
