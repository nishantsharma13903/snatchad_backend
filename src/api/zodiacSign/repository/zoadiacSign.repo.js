const logger = require("@/utils/logger/logger.utils");
const ZodiacSign = require("../model/zoadiacSign.model");

exports.createZodiacSign = async (name) => {
  try {
    const newZodiacSign = new ZodiacSign({ name });
    return await newZodiacSign.save();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getZodiacSignById = async (id) => {
  try {
    const zodiacSign = await ZodiacSign.findOne({ _id: id });
    return zodiacSign;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getZodiacSignByName = async (name) => {
  try {
    const existingZodiacSign = await ZodiacSign.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    return existingZodiacSign;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getAllZodiacSign = async (
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

    const zodiacSigns = await ZodiacSign.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .select(selectedFields)
      .lean();

    const totalRecords = await ZodiacSign.countDocuments(query);

    return {
      data: zodiacSigns,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    };
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.updateZodiacSignById = async (id, payload) => {
  try {
    const updatedZodiacSign = await ZodiacSign.findByIdAndUpdate(id, {
      $set: payload,
    });
    return updatedZodiacSign;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.checkZodiacSignExistance = async (name) => {
  try {
    const isExist = await ZodiacSign.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.checkZodiacSignExistanceForUpdate = async (name, id) => {
  try {
    const isExist = await ZodiacSign.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i")}, _id: { $ne: id }, status : "Active", // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.deleteZodiacSignByName = async (name, id) => {
  try {
    return await ZodiacSign.deleteMany({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      status: "Delete",
    });
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};
