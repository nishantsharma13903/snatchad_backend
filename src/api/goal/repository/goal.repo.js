const logger = require("@/utils/logger/logger.utils");
const Goal = require("../model/goal.model");

exports.createGoal = async (name) => {
  try {
    const newGoal = new Goal({ name });
    return await newGoal.save();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getGoalById = async (id) => {
  try {
    const goal = await Goal.findOne({ _id: id });
    return goal;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getGoalByName = async (name) => {
  try {
    const existingGoal = await Goal.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    return existingGoal;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getAllGoal = async (
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

    const sexualities = await Goal.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .select(selectedFields)
      .lean();

    const totalRecords = await Goal.countDocuments(query);

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

exports.updateGoalById = async (id, payload) => {
  try {
    const updatedGoal = await Goal.findByIdAndUpdate(id, {
      $set: payload,
    });
    return updatedGoal;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.checkGoalExistance = async (name) => {
  try {
    const isExist = await Goal.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.checkGoalExistanceForUpdate = async (name, id) => {
  try {
    const isExist = await Goal.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i")}, _id: { $ne: id }, status : "Active" // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.deleteGoalByName = async (name, id) => {
  try {
    return await Goal.deleteMany({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      status: "Delete",
    });
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};
