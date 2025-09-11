const logger = require("@/utils/logger/logger.utils");
const Pronoun = require("../model/pronoun.model");

exports.createPronoun = async (name) => {
  try {
    const newPronoun = new Pronoun({ name });
    return await newPronoun.save();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getPronounById = async (id) => {
  try {
    const pronoun = await Pronoun.findOne({ _id: id });
    return pronoun;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getPronounByName = async (name) => {
  try {
    const existingPronoun = await Pronoun.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    return existingPronoun;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getAllPronoun = async (
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

    const pronouns = await Pronoun.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .select(selectedFields)
      .lean();

    const totalRecords = await Pronoun.countDocuments(query);

    return {
      data: pronouns,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    };
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.updatePronounById = async (id, payload) => {
  try {
    const updatedPronoun = await Pronoun.findByIdAndUpdate(id, {
      $set: payload,
    });
    return updatedPronoun;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.checkPronounExistance = async (name) => {
  try {
    const isExist = await Pronoun.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.checkPronounExistanceForUpdate = async (name, id) => {
  try {
    const isExist = await Pronoun.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i")}, _id: { $ne: id }, status : "Active", // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.deletePronounByName = async (name, id) => {
  try {
    return await Pronoun.deleteMany({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      status: "Delete",
    });
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};
