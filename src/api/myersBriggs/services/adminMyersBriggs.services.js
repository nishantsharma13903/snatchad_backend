const {
  createMyersBriggs,
  updateMyersBriggsById,
  checkMyersBriggsExistanceForUpdate,
  getMyersBriggsById,
  getMyersBriggsByName,
  deleteMyersBriggsByName,
} = require("@/api/myersBriggs/repository/myersBriggs.repo");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleCreateMyersBriggs = async (name) => {
  try {
    const existingMyersBriggs = await getMyersBriggsByName(name);

    if (existingMyersBriggs && existingMyersBriggs.status === "Active") {
      return ResponseHandler.result(400, false, "Already Exist", {});
    }

    if (existingMyersBriggs && existingMyersBriggs.status === "Delete") {
      await deleteMyersBriggsByName(name);
    }

    const newMyersBriggs = await createMyersBriggs(name);

    if (!newMyersBriggs) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while creating myersBriggs",
        {}
      );
    }

    return ResponseHandler.result(200, true, `MyersBriggs created successfully`, {});
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

exports.handleUpdateMyersBriggs = async (id, payload) => {
  try {
    if (payload && payload?.name) {
      const isAlreadyExist = await checkMyersBriggsExistanceForUpdate(
        payload?.name,
        id
      );

      if (isAlreadyExist) {
        return ResponseHandler.result(400, false, "Already Exist", {});
      }

      await deleteMyersBriggsByName(payload?.name);
    }

    const updatedMyersBriggs = await updateMyersBriggsById(id, payload);

    if (!updatedMyersBriggs) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while updating myersBriggs",
        {}
      );
    }

    return ResponseHandler.result(200, true, `MyersBriggs updated successfully`, {});
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

exports.handleGetMyersBriggsById = async (id) => {
  try {
    const myersBriggs = await getMyersBriggsById(id);

    if (!myersBriggs) {
      return ResponseHandler.result(404, false, "MyersBriggs not found", {});
    }

    return ResponseHandler.result(200, true, `MyersBriggs fetched successfully`, myersBriggs);
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