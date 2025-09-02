const logger = require("@/utils/logger/logger.utils");
const Kids = require("../model/kids.model");

exports.createKids = async (name) => {
  try {
    const newKids = new Kids({ name });
    return await newKids.save();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getKidsById = async (id) => {
  try {
    const kids = await Kids.findOne({ _id: id });
    return kids;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getKidsByName = async (name) => {
  try {
    const existingKids = await Kids.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    return existingKids;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getAllKids = async (
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

    const kidss = await Kids.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .select(selectedFields)
      .lean();

    const totalRecords = await Kids.countDocuments(query);

    return {
      data: kidss,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    };
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.updateKidsById = async (id, payload) => {
  try {
    const updatedKids = await Kids.findByIdAndUpdate(id, {
      $set: payload,
    });
    return updatedKids;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.checkKidsExistance = async (name) => {
  try {
    const isExist = await Kids.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.checkKidsExistanceForUpdate = async (name, id) => {
  try {
    const isExist = await Kids.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i")}, _id: { $ne: id }, status : "Active", // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.deleteKidsByName = async (name, id) => {
  try {
    return await Kids.deleteMany({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      status: "Delete",
    });
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};
