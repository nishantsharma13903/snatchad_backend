const logger = require("@/utils/logger/logger.utils");
const Enneagram = require("../model/enneagram.model");

exports.createEnneagram = async (name) => {
  try {
    const newEnneagram = new Enneagram({ name });
    return await newEnneagram.save();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getEnneagramById = async (id) => {
  try {
    const enneagram = await Enneagram.findOne({ _id: id });
    return enneagram;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getEnneagramByName = async (name) => {
  try {
    const existingEnneagram = await Enneagram.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    return existingEnneagram;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getAllEnneagram = async (
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

    const enneagrams = await Enneagram.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .select(selectedFields)
      .lean();

    const totalRecords = await Enneagram.countDocuments(query);

    return {
      data: enneagrams,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    };
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.updateEnneagramById = async (id, payload) => {
  try {
    const updatedEnneagram = await Enneagram.findByIdAndUpdate(id, {
      $set: payload,
    });
    return updatedEnneagram;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.checkEnneagramExistance = async (name) => {
  try {
    const isExist = await Enneagram.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.checkEnneagramExistanceForUpdate = async (name, id) => {
  try {
    const isExist = await Enneagram.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i")}, _id: { $ne: id }, status : "Active", // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.deleteEnneagramByName = async (name, id) => {
  try {
    return await Enneagram.deleteMany({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      status: "Delete",
    });
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};
