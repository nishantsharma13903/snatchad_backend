const logger = require("@/utils/logger/logger.utils");
const Interest = require("../model/interest.model");

exports.createInterest = async (name) => {
  try {
    const newInterest = new Interest({ name });
    return await newInterest.save();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getInterestById = async (id) => {
  try {
    const interest = await Interest.findOne({ _id: id });
    return interest;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getInterestByName = async (name) => {
  try {
    const existingInterest = await Interest.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    return existingInterest;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getAllInterest = async (
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

    const sexualities = await Interest.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .select(selectedFields)
      .lean();

    const totalRecords = await Interest.countDocuments(query);

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

exports.updateInterestById = async (id, payload) => {
  try {
    const updatedInterest = await Interest.findByIdAndUpdate(id, {
      $set: payload,
    });
    return updatedInterest;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.checkInterestExistance = async (name) => {
  try {
    const isExist = await Interest.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.checkInterestExistanceForUpdate = async (name, id) => {
  try {
    const isExist = await Interest.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i")}, _id: { $ne: id }, status : "Active", // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.deleteInterestByName = async (name, id) => {
  try {
    return await Interest.deleteMany({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      status: "Delete",
    });
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};
