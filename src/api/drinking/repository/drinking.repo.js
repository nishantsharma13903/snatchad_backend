const logger = require("@/utils/logger/logger.utils");
const Drinking = require("../model/drinking.model");

exports.createDrinking = async (name) => {
  try {
    const newDrinking = new Drinking({ name });
    return await newDrinking.save();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getDrinkingById = async (id) => {
  try {
    const drinking = await Drinking.findOne({ _id: id });
    return drinking;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getDrinkingByName = async (name) => {
  try {
    const existingDrinking = await Drinking.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    return existingDrinking;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getAllDrinking = async (
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

    const drinkings = await Drinking.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .select(selectedFields)
      .lean();

    const totalRecords = await Drinking.countDocuments(query);

    return {
      data: drinkings,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    };
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.updateDrinkingById = async (id, payload) => {
  try {
    const updatedDrinking = await Drinking.findByIdAndUpdate(id, {
      $set: payload,
    });
    return updatedDrinking;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.checkDrinkingExistance = async (name) => {
  try {
    const isExist = await Drinking.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.checkDrinkingExistanceForUpdate = async (name, id) => {
  try {
    const isExist = await Drinking.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i")}, _id: { $ne: id }, status : "Active", // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.deleteDrinkingByName = async (name, id) => {
  try {
    return await Drinking.deleteMany({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      status: "Delete",
    });
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};
