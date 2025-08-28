const {
  createRelationship,
  updateRelationshipById,
  checkRelationshipExistanceForUpdate,
  getRelationshipById,
  getRelationshipByName,
  deleteRelationshipByName,
} = require("@/api/relationship/repository/relationship.repo");
const logger = require("@/utils/logger/logger.utils");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleCreateRelationship = async (name) => {
  try {
    const existingRelationship = await getRelationshipByName(name);

    if (existingRelationship && existingRelationship.status === "Active") {
      return ResponseHandler.result(400, false, "Already Exist", {});
    }

    if (existingRelationship && existingRelationship.status === "Delete") {
      await deleteRelationshipByName(name);
    }

    const newRelationship = await createRelationship(name);

    if (!newRelationship) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while creating relationship",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Relationship created successfully`, {});
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

exports.handleUpdateRelationship = async (id, payload) => {
  try {
    if (payload && payload?.name) {
      const isAlreadyExist = await checkRelationshipExistanceForUpdate(
        payload?.name,
        id
      );

      if (isAlreadyExist) {
        return ResponseHandler.result(400, false, "Already Exist", {});
      }

      await deleteRelationshipByName(payload?.name);
    }

    const updatedRelationship = await updateRelationshipById(id, payload);

    if (!updatedRelationship) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while updating relationship",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Relationship updated successfully`, {});
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

exports.handleGetRelationshipById = async (id) => {
  try {
    const relationship = await getRelationshipById(id);

    if (!relationship) {
      return ResponseHandler.result(404, false, "Relationship not found", {});
    }

    return ResponseHandler.result(200, true, `Relationship fetched successfully`, relationship);
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