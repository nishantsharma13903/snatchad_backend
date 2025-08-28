const logger = require("@/utils/logger/logger.utils");
const Height = require("../model/height.model");

exports.createHeight = async (heightInCm, heightInFoot) => {
  try {
    console.log("heightInCm, heightInFoot",heightInCm, heightInFoot)
    const newHeight = new Height({ heightInCm, heightInFoot });
    return await newHeight.save();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getHeightById = async (id) => {
  try {
    const height = await Height.findOne({ _id: id });
    return height;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getHeightByNumber = async (height) => {
  try {
    const existingHeight = await Height.findOne({ heightInCm: height });
    return existingHeight;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getAllHeight = async (
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

    const sexualities = await Height.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .select(selectedFields)
      .lean();

    const totalRecords = await Height.countDocuments(query);

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

exports.updateHeightById = async (id, payload) => {
  try {
    const updatedHeight = await Height.findByIdAndUpdate(id, {
      $set: payload,
    });
    return updatedHeight;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.checkHeightExistance = async (name) => {
  try {
    const isExist = await Height.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.checkHeightExistanceForUpdate = async (height, id) => {
  try {
    const isExist = await Height.findOne({
      heightInCm: height,
      _id: { $ne: id },
      status: "Active", // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.deleteHeightByNumber = async (height, id) => {
  try {
    return await Height.deleteMany({
      heightInCm: height,
      status: "Delete",
    });
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};
