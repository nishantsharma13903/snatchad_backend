const logger = require("@/utils/logger/logger.utils");
const MyersBriggs = require("../model/myersBriggs.model");

exports.createMyersBriggs = async (name) => {
  try {
    const newMyersBriggs = new MyersBriggs({ name });
    return await newMyersBriggs.save();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getMyersBriggsById = async (id) => {
  try {
    const myersBriggs = await MyersBriggs.findOne({ _id: id });
    return myersBriggs;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getMyersBriggsByName = async (name) => {
  try {
    const existingMyersBriggs = await MyersBriggs.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    return existingMyersBriggs;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getAllMyersBriggs = async (
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

    const myersBriggss = await MyersBriggs.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .select(selectedFields)
      .lean();

    const totalRecords = await MyersBriggs.countDocuments(query);

    return {
      data: myersBriggss,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    };
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.updateMyersBriggsById = async (id, payload) => {
  try {
    const updatedMyersBriggs = await MyersBriggs.findByIdAndUpdate(id, {
      $set: payload,
    });
    return updatedMyersBriggs;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.checkMyersBriggsExistance = async (name) => {
  try {
    const isExist = await MyersBriggs.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.checkMyersBriggsExistanceForUpdate = async (name, id) => {
  try {
    const isExist = await MyersBriggs.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i")}, _id: { $ne: id }, status : "Active", // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.deleteMyersBriggsByName = async (name, id) => {
  try {
    return await MyersBriggs.deleteMany({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      status: "Delete",
    });
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};
