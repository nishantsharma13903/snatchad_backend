const logger = require("@/utils/logger/logger.utils");
const Sexuality = require("../model/sexuality.model");

exports.createSexuality = async (name) => {
  try {
    const newSexuality = new Sexuality({ name });
    return await newSexuality.save();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getSexualityById = async (id) => {
  try {
    const sexuality = await Sexuality.findOne({ _id: id });
    return sexuality;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getSexualityByName = async (name) => {
  try {
    const existingSexuality = await Sexuality.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    return existingSexuality;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getAllSexuality = async (
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

    const sexualities = await Sexuality.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .select(selectedFields)
      .lean();

    const totalRecords = await Sexuality.countDocuments(query);

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

exports.updateSexualityById = async (id, payload) => {
  try {
    const updatedSexuality = await Sexuality.findByIdAndUpdate(id, {
      $set: payload,
    });
    return updatedSexuality;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.checkSexualityExistance = async (name) => {
  try {
    const isExist = await Sexuality.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.checkSexualityExistanceForUpdate = async (name, id) => {
  try {
    const isExist = await Sexuality.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i")}, _id: { $ne: id }, status : "Active" // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.deleteSexualityByName = async (name, id) => {
  try {
    return await Sexuality.deleteMany({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      status: "Delete",
    });
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};
