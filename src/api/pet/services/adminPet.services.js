const {
  createPet,
  updatePetById,
  checkPetExistanceForUpdate,
  getPetById,
  getPetByName,
  deletePetByName,
} = require("@/api/pet/repository/pet.repo");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleCreatePet = async (name) => {
  try {
    const existingPet = await getPetByName(name);

    if (existingPet && existingPet.status === "Active") {
      return ResponseHandler.result(400, false, "Already Exist", {});
    }

    if (existingPet && existingPet.status === "Delete") {
      await deletePetByName(name);
    }

    const newPet = await createPet(name);

    if (!newPet) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while creating pet",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Pet created successfully`, {});
  } catch (error) {
    logger.error(error);
    return ResponseHandler.result(
      500,
      false,
      error.message || "Internal Server Error",
      {}
    );
  }
};

exports.handleUpdatePet = async (id, payload) => {
  try {
    if (payload && payload?.name) {
      const isAlreadyExist = await checkPetExistanceForUpdate(
        payload?.name,
        id
      );

      if (isAlreadyExist) {
        return ResponseHandler.result(400, false, "Already Exist", {});
      }

      await deletePetByName(payload?.name);
    }

    const updatedPet = await updatePetById(id, payload);

    if (!updatedPet) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while updating pet",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Pet updated successfully`, {});
  } catch (error) {
    logger.error(error);
    return ResponseHandler.result(
      500,
      false,
      error.message || "Internal Server Error",
      {}
    );
  }
};

exports.handleGetPetById = async (id) => {
  try {
    const pet = await getPetById(id);

    if (!pet) {
      return ResponseHandler.result(404, false, "Pet not found", {});
    }

    return ResponseHandler.result(200, true, `Pet fetched successfully`, pet);
  } catch (error) {
    logger.error(error);
    return ResponseHandler.result(
      500,
      false,
      error.message || "Internal Server Error",
      {}
    );
  }
};