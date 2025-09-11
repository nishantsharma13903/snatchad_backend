const logger = require("@/utils/logger/logger.utils");
const Pet = require("../model/pet.model");

exports.createPet = async (name) => {
  try {
    const newPet = new Pet({ name });
    return await newPet.save();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getPetById = async (id) => {
  try {
    const pet = await Pet.findOne({ _id: id });
    return pet;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getPetByName = async (name) => {
  try {
    const existingPet = await Pet.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    return existingPet;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getAllPet = async (
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

    const pets = await Pet.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .select(selectedFields)
      .lean();

    const totalRecords = await Pet.countDocuments(query);

    return {
      data: pets,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    };
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.updatePetById = async (id, payload) => {
  try {
    const updatedPet = await Pet.findByIdAndUpdate(id, {
      $set: payload,
    });
    return updatedPet;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.checkPetExistance = async (name) => {
  try {
    const isExist = await Pet.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.checkPetExistanceForUpdate = async (name, id) => {
  try {
    const isExist = await Pet.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i")}, _id: { $ne: id }, status : "Active", // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.deletePetByName = async (name, id) => {
  try {
    return await Pet.deleteMany({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      status: "Delete",
    });
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};
