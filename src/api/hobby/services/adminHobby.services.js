const {
  createHobby,
  updateHobbyById,
  checkHobbyExistanceForUpdate,
  getHobbyById,
  getHobbyByName,
  deleteHobbyByName,
} = require("@/api/hobby/repository/hobby.repo");
const { deleteFile } = require("@/utils/files/file.utils");
const logger = require("@/utils/logger/logger.utils");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleCreateHobby = async (name,icon) => {
  try {
    const existingHobby = await getHobbyByName(name);

    if (existingHobby && existingHobby.status === "Active") {
      return ResponseHandler.result(400, false, "Already Exist", {});
    }

    if (existingHobby && existingHobby.status === "Delete") {
      await deleteHobbyByName(name);
    }

    const newHobby = await createHobby(name,icon);

    if (!newHobby) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while creating hobby",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Hobby created successfully`, {});
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

exports.handleUpdateHobby = async (id, payload) => {
  try {
    if (payload && payload?.name) {
      const isAlreadyExist = await checkHobbyExistanceForUpdate(
        payload?.name,
        id
      );

      if (isAlreadyExist) {
        return ResponseHandler.result(400, false, "Already Exist", {});
      }

      await deleteHobbyByName(payload?.name);
    }

    if(payload && payload?.icon){
      const existingHobby = await getHobbyById(id)

            // ✅ Remove old file if it exists
      if (existingHobby?.icon) {

        deleteFile(existingHobby?.icon || "");
        // const oldFilePath = path.join(__dirname, "..", "..", existingHobby.icon); 
        // console.log("Old Field Path", oldFilePath);
        // if (fs.existsSync(oldFilePath)) {
        //   fs.unlinkSync(oldFilePath);
        //   console.log("Old file removed:", oldFilePath);
        // }
      }
    }

    const updatedHobby = await updateHobbyById(id, payload);

    if (!updatedHobby) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while updating hobby",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Hobby updated successfully`, {});
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

exports.handleGetHobbyById = async (id) => {
  try {
    const hobby = await getHobbyById(id);

    if (!hobby) {
      return ResponseHandler.result(404, false, "Hobby not found", {});
    }

    return ResponseHandler.result(200, true, `Hobby fetched successfully`, hobby);
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