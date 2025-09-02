const logger = require("@/utils/logger/logger.utils");
const THC = require("../model/thc.model");

exports.createTHC = async (name) => {
  try {
    const newTHC = new THC({ name });
    return await newTHC.save();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getTHCById = async (id) => {
  try {
    const thc = await THC.findOne({ _id: id });
    return thc;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getTHCByName = async (name) => {
  try {
    const existingTHC = await THC.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    return existingTHC;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getAllTHC = async (
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

    const thcs = await THC.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .select(selectedFields)
      .lean();

    const totalRecords = await THC.countDocuments(query);

    return {
      data: thcs,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    };
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.updateTHCById = async (id, payload) => {
  try {
    const updatedTHC = await THC.findByIdAndUpdate(id, {
      $set: payload,
    });
    return updatedTHC;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.checkTHCExistance = async (name) => {
  try {
    const isExist = await THC.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.checkTHCExistanceForUpdate = async (name, id) => {
  try {
    const isExist = await THC.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i")}, _id: { $ne: id }, status : "Active", // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.deleteTHCByName = async (name, id) => {
  try {
    return await THC.deleteMany({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      status: "Delete",
    });
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};
