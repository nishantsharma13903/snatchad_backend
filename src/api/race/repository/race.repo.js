const logger = require("@/utils/logger/logger.utils");
const Race = require("../model/race.model");

exports.createRace = async (name) => {
  try {
    const newRace = new Race({ name });
    return await newRace.save();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getRaceById = async (id) => {
  try {
    const race = await Race.findOne({ _id: id });
    return race;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getRaceByName = async (name) => {
  try {
    const existingRace = await Race.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    return existingRace;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getAllRace = async (
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

    const races = await Race.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .select(selectedFields)
      .lean();

    const totalRecords = await Race.countDocuments(query);

    return {
      data: races,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    };
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.updateRaceById = async (id, payload) => {
  try {
    const updatedRace = await Race.findByIdAndUpdate(id, {
      $set: payload,
    });
    return updatedRace;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.checkRaceExistance = async (name) => {
  try {
    const isExist = await Race.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.checkRaceExistanceForUpdate = async (name, id) => {
  try {
    const isExist = await Race.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i")}, _id: { $ne: id }, status : "Active", // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.deleteRaceByName = async (name, id) => {
  try {
    return await Race.deleteMany({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      status: "Delete",
    });
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};
