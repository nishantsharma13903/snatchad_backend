const logger = require("@/utils/logger/logger.utils");
const PoliticalStance = require("../model/politicalStance.model");

exports.createPoliticalStance = async (name) => {
  try {
    const newPoliticalStance = new PoliticalStance({ name });
    return await newPoliticalStance.save();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getPoliticalStanceById = async (id) => {
  try {
    const politicalStance = await PoliticalStance.findOne({ _id: id });
    return politicalStance;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getPoliticalStanceByName = async (name) => {
  try {
    const existingPoliticalStance = await PoliticalStance.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    return existingPoliticalStance;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getAllPoliticalStance = async (
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

    const politicalStances = await PoliticalStance.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .select(selectedFields)
      .lean();

    const totalRecords = await PoliticalStance.countDocuments(query);

    return {
      data: politicalStances,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    };
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.updatePoliticalStanceById = async (id, payload) => {
  try {
    const updatedPoliticalStance = await PoliticalStance.findByIdAndUpdate(id, {
      $set: payload,
    });
    return updatedPoliticalStance;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.checkPoliticalStanceExistance = async (name) => {
  try {
    const isExist = await PoliticalStance.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.checkPoliticalStanceExistanceForUpdate = async (name, id) => {
  try {
    const isExist = await PoliticalStance.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i")}, _id: { $ne: id }, status : "Active", // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.deletePoliticalStanceByName = async (name, id) => {
  try {
    return await PoliticalStance.deleteMany({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      status: "Delete",
    });
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};
