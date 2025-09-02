const logger = require("@/utils/logger/logger.utils");
const Smoking = require("../model/smoking.model");

exports.createSmoking = async (name) => {
  try {
    const newSmoking = new Smoking({ name });
    return await newSmoking.save();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getSmokingById = async (id) => {
  try {
    const smoking = await Smoking.findOne({ _id: id });
    return smoking;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getSmokingByName = async (name) => {
  try {
    const existingSmoking = await Smoking.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    return existingSmoking;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getAllSmoking = async (
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

    const smokings = await Smoking.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .select(selectedFields)
      .lean();

    const totalRecords = await Smoking.countDocuments(query);

    return {
      data: smokings,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    };
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.updateSmokingById = async (id, payload) => {
  try {
    const updatedSmoking = await Smoking.findByIdAndUpdate(id, {
      $set: payload,
    });
    return updatedSmoking;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.checkSmokingExistance = async (name) => {
  try {
    const isExist = await Smoking.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.checkSmokingExistanceForUpdate = async (name, id) => {
  try {
    const isExist = await Smoking.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i")}, _id: { $ne: id }, status : "Active", // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.deleteSmokingByName = async (name, id) => {
  try {
    return await Smoking.deleteMany({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      status: "Delete",
    });
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};
