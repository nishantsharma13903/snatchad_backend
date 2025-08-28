const logger = require("@/utils/logger/logger.utils");
const Hobby = require("../model/hobby.model");

exports.createHobby = async (name,icon) => {
  try {
    const newHobby = new Hobby({ name,icon });
    return await newHobby.save();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getHobbyById = async (id) => {
  try {
    const hobby = await Hobby.findOne({ _id: id }).lean();
    return hobby;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getHobbyByName = async (name) => {
  try {
    const existingHobby = await Hobby.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    return existingHobby;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getAllHobby = async (
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

    const sexualities = await Hobby.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .select(selectedFields)
      .lean();

    const totalRecords = await Hobby.countDocuments(query);

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

exports.updateHobbyById = async (id, payload) => {
  try {
    const updatedHobby = await Hobby.findByIdAndUpdate(id, {
      $set: payload,
    });
    return updatedHobby;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.checkHobbyExistance = async (name) => {
  try {
    const isExist = await Hobby.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.checkHobbyExistanceForUpdate = async (name, id) => {
  try {
    const isExist = await Hobby.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i")}, _id: { $ne: id }, status : "Active", // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.deleteHobbyByName = async (name, id) => {
  try {
    return await Hobby.deleteMany({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      status: "Delete",
    });
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};
