const logger = require("@/utils/logger/logger.utils");
const Relationship = require("../model/relationship.model");

exports.createRelationship = async (name) => {
  try {
    const newRelationship = new Relationship({ name });
    return await newRelationship.save();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getRelationshipById = async (id) => {
  try {
    const relationship = await Relationship.findOne({ _id: id });
    return relationship;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getRelationshipByName = async (name) => {
  try {
    const existingRelationship = await Relationship.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    return existingRelationship;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getAllRelationship = async (
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

    const sexualities = await Relationship.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .select(selectedFields)
      .lean();

    const totalRecords = await Relationship.countDocuments(query);

    return {
      data: sexualities,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    };
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.updateRelationshipById = async (id, payload) => {
  try {
    const updatedRelationship = await Relationship.findByIdAndUpdate(id, {
      $set: payload,
    });
    return updatedRelationship;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.checkRelationshipExistance = async (name) => {
  try {
    const isExist = await Relationship.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.checkRelationshipExistanceForUpdate = async (name, id) => {
  try {
    const isExist = await Relationship.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i")}, _id: { $ne: id }, status : "Active", // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.deleteRelationshipByName = async (name, id) => {
  try {
    return await Relationship.deleteMany({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      status: "Delete",
    });
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};
