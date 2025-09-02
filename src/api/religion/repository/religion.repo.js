const logger = require("@/utils/logger/logger.utils");
const Religion = require("../model/religion.model");

exports.createReligion = async (name) => {
  try {
    const newReligion = new Religion({ name });
    return await newReligion.save();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getReligionById = async (id) => {
  try {
    const religion = await Religion.findOne({ _id: id });
    return religion;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getReligionByName = async (name) => {
  try {
    const existingReligion = await Religion.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    return existingReligion;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getAllReligion = async (
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

    const religions = await Religion.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .select(selectedFields)
      .lean();

    const totalRecords = await Religion.countDocuments(query);

    return {
      data: religions,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    };
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.updateReligionById = async (id, payload) => {
  try {
    const updatedReligion = await Religion.findByIdAndUpdate(id, {
      $set: payload,
    });
    return updatedReligion;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.checkReligionExistance = async (name) => {
  try {
    const isExist = await Religion.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.checkReligionExistanceForUpdate = async (name, id) => {
  try {
    const isExist = await Religion.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i")}, _id: { $ne: id }, status : "Active", // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.deleteReligionByName = async (name, id) => {
  try {
    return await Religion.deleteMany({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      status: "Delete",
    });
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};
