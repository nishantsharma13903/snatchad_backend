const logger = require("@/utils/logger/logger.utils");
const Gender = require("../model/gender.model");

exports.createGender = async (name) => {
  try {
    const newGender = new Gender({ name });
    return await newGender.save();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getGenderById = async (id) => {
  try {
    const gender = await Gender.findOne({ _id: id });
    return gender;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getGenderByName = async (name) => {
  try {
    const existingGender = await Gender.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    return existingGender;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getAllGenders = async (
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

    const genders = await Gender.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .select(selectedFields)
      .lean();

    const totalRecords = await Gender.countDocuments(query);

    return {
      data: genders,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    };
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.updateGenderById = async (id, payload) => {
  try {
    const updatedGender = await Gender.findByIdAndUpdate(id, {
      $set: payload,
    });
    return updatedGender;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.checkGenderExistance = async (name) => {
  try {
    const isExist = await Gender.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.checkGenderExistanceForUpdate = async (name, id) => {
  try {
    const isExist = await Gender.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      _id: { $ne : id },
      status: "Active", // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.deleteGenderByName = async (name, id) => {
  try {
    return await Gender.deleteMany({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      status: "Delete",
    });
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};
