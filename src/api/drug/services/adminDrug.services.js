const {
  createDrug,
  updateDrugById,
  checkDrugExistanceForUpdate,
  getDrugById,
  getDrugByName,
  deleteDrugByName,
} = require("@/api/drug/repository/drug.repo");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleCreateDrug = async (name) => {
  try {
    const existingDrug = await getDrugByName(name);

    if (existingDrug && existingDrug.status === "Active") {
      return ResponseHandler.result(400, false, "Already Exist", {});
    }

    if (existingDrug && existingDrug.status === "Delete") {
      await deleteDrugByName(name);
    }

    const newDrug = await createDrug(name);

    if (!newDrug) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while creating drug",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Drug created successfully`, {});
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

exports.handleUpdateDrug = async (id, payload) => {
  try {
    if (payload && payload?.name) {
      const isAlreadyExist = await checkDrugExistanceForUpdate(
        payload?.name,
        id
      );

      if (isAlreadyExist) {
        return ResponseHandler.result(400, false, "Already Exist", {});
      }

      await deleteDrugByName(payload?.name);
    }

    const updatedDrug = await updateDrugById(id, payload);

    if (!updatedDrug) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while updating drug",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Drug updated successfully`, {});
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

exports.handleGetDrugById = async (id) => {
  try {
    const drug = await getDrugById(id);

    if (!drug) {
      return ResponseHandler.result(404, false, "Drug not found", {});
    }

    return ResponseHandler.result(200, true, `Drug fetched successfully`, drug);
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