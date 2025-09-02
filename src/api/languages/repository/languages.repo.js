const logger = require("@/utils/logger/logger.utils");
const Languages = require("../model/languages.model");

exports.createLanguages = async (name) => {
  try {
    const newLanguages = new Languages({ name });
    return await newLanguages.save();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getLanguagesById = async (id) => {
  try {
    const languages = await Languages.findOne({ _id: id });
    return languages;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getLanguagesByName = async (name) => {
  try {
    const existingLanguages = await Languages.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    return existingLanguages;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getAllLanguages = async (
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

    const languagess = await Languages.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .select(selectedFields)
      .lean();

    const totalRecords = await Languages.countDocuments(query);

    return {
      data: languagess,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    };
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.updateLanguagesById = async (id, payload) => {
  try {
    const updatedLanguages = await Languages.findByIdAndUpdate(id, {
      $set: payload,
    });
    return updatedLanguages;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.checkLanguagesExistance = async (name) => {
  try {
    const isExist = await Languages.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.checkLanguagesExistanceForUpdate = async (name, id) => {
  try {
    const isExist = await Languages.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i")}, _id: { $ne: id }, status : "Active", // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.deleteLanguagesByName = async (name, id) => {
  try {
    return await Languages.deleteMany({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      status: "Delete",
    });
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};
