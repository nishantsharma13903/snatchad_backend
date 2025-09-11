const logger = require("@/utils/logger/logger.utils");
const Alcohol = require("../model/alcohol.model");

exports.createAlcohol = async (name) => {
  try {
    const newAlcohol = new Alcohol({ name });
    return await newAlcohol.save();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getAlcoholById = async (id) => {
  try {
    const alcohol = await Alcohol.findOne({ _id: id });
    return alcohol;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getAlcoholByName = async (name) => {
  try {
    const existingAlcohol = await Alcohol.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    return existingAlcohol;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getAllAlcohol = async (
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

    const alcohols = await Alcohol.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .select(selectedFields)
      .lean();

    const totalRecords = await Alcohol.countDocuments(query);

    return {
      data: alcohols,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    };
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.updateAlcoholById = async (id, payload) => {
  try {
    const updatedAlcohol = await Alcohol.findByIdAndUpdate(id, {
      $set: payload,
    });
    return updatedAlcohol;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.checkAlcoholExistance = async (name) => {
  try {
    const isExist = await Alcohol.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.checkAlcoholExistanceForUpdate = async (name, id) => {
  try {
    const isExist = await Alcohol.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i")}, _id: { $ne: id }, status : "Active", // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.deleteAlcoholByName = async (name, id) => {
  try {
    return await Alcohol.deleteMany({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      status: "Delete",
    });
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};
