const logger = require("@/utils/logger/logger.utils");
const DateIdea = require("../model/dateIdea.model");

exports.createDateIdea = async (name) => {
  try {
    const newDateIdea = new DateIdea({ name });
    return await newDateIdea.save();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getDateIdeaById = async (id) => {
  try {
    const dateIdea = await DateIdea.findOne({ _id: id });
    return dateIdea;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getDateIdeaByName = async (name) => {
  try {
    const existingDateIdea = await DateIdea.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    return existingDateIdea;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getAllDateIdea = async (
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

    const dateIdeas = await DateIdea.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .select(selectedFields)
      .lean();

    const totalRecords = await DateIdea.countDocuments(query);

    return {
      data: dateIdeas,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    };
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.updateDateIdeaById = async (id, payload) => {
  try {
    const updatedDateIdea = await DateIdea.findByIdAndUpdate(id, {
      $set: payload,
    });
    return updatedDateIdea;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.checkDateIdeaExistance = async (name) => {
  try {
    const isExist = await DateIdea.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.checkDateIdeaExistanceForUpdate = async (name, id) => {
  try {
    const isExist = await DateIdea.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i")}, _id: { $ne: id }, status : "Active", // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.deleteDateIdeaByName = async (name, id) => {
  try {
    return await DateIdea.deleteMany({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      status: "Delete",
    });
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};
