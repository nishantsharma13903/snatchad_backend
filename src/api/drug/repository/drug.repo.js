const logger = require("@/utils/logger/logger.utils");
const Drug = require("../model/drug.model");

exports.createDrug = async (name) => {
  try {
    const newDrug = new Drug({ name });
    return await newDrug.save();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getDrugById = async (id) => {
  try {
    const drug = await Drug.findOne({ _id: id });
    return drug;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getDrugByName = async (name) => {
  try {
    const existingDrug = await Drug.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    return existingDrug;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getAllDrug = async (
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

    const drugs = await Drug.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .select(selectedFields)
      .lean();

    const totalRecords = await Drug.countDocuments(query);

    return {
      data: drugs,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    };
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.updateDrugById = async (id, payload) => {
  try {
    const updatedDrug = await Drug.findByIdAndUpdate(id, {
      $set: payload,
    });
    return updatedDrug;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.checkDrugExistance = async (name) => {
  try {
    const isExist = await Drug.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.checkDrugExistanceForUpdate = async (name, id) => {
  try {
    const isExist = await Drug.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i")}, _id: { $ne: id }, status : "Active", // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.deleteDrugByName = async (name, id) => {
  try {
    return await Drug.deleteMany({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      status: "Delete",
    });
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};
