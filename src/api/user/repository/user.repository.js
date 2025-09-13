const logger = require("@utils/logger/logger.utils");
const User = require("../model/user.model");
const mongoose = require("mongoose");

exports.checkUserNameExist = async (userName) => {
  try {
    const result = await User.exists({ userName });
    return !!result; // returns true if found, false otherwise
  } catch (error) {
    logger.error("Error checking username existence:", error);
    throw error;
  }
};

exports.checkReferralCodeExist = async (refCode) => {
  try {
    const result = await User.exists({ referralCode: refCode });
    console.log("respo", result);
    return !!result; // returns true if found, false otherwise
  } catch (error) {
    logger.error("Error checking username existence:", error);
    throw error;
  }
};

exports.checkUserExist = async (identifier, type) => {
  try {
    let result = false;
    if (type === "email") {
      result = await User.exists({ email: identifier });
    } else if (type === "phone") {
      result = await User.exists({ phone: identifier });
    }

    return !!result; // returns true if found, false otherwise
  } catch (error) {
    logger.error("Error checking existence:", error);
    throw error;
  }
};

exports.checkUserExistByPhone = async (phone) => {
  try {
    let result = false;
    result = await User.exists({ phone: phone });

    return !!result; // returns true if found, false otherwise
  } catch (error) {
    logger.error("Error checking existence:", error);
    throw error;
  }
};

exports.createNewUser = async (userData) => {
  try {
    const newUser = new User(userData);
    return await newUser.save();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.updateUser = async (userId, payload) => {
  try {
    await User.findByIdAndUpdate(
      userId,
      {
        $set: payload,
      },
      { new: true }
    );
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getUserByPhone = async (phone, selectedFields) => {
  try {
    let result = {};

    result = await User.findOne({ phone: phone }).select(selectedFields).lean();

    return result;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getProfileStep = async (userId) => {
  try {
    const user = await User.findById(userId, "profileStep");
    if (!user) throw new Error("User not found");
    return user.profileStep;
  } catch (error) {
    logger.error("Error : ", error);
  }
};

exports.getUserById = async (userId, selectedFields) => {
  try {
    return await User.findOne({ _id: userId }).select(selectedFields).lean();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getUserByReferralCode = async (referralCode, selectedFields) => {
  try {
    return await User.findOne({ referralCode }).select(selectedFields).lean();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getUsersByMode = async (
  mode,
  selectedFields,
  page = 1,
  limit = 10,
  search = ""
) => {
  try {
    page = Number.parseInt(page);
    limit = Number.parseInt(limit);
    const skip = (page - 1) * limit;

    const query = { status: "Active" };

    if (mode === "quiz") {
      selectedFields += " profiles.quiz";
    } else if (mode === "snatched") {
      selectedFields += " profiles.snatched";
    } else if (mode === "versus") {
      selectedFields += " profiles.versus";
    }

    if (search) {
      query.$or = [
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .select(selectedFields)
      .skip(skip)
      .limit(limit)
      .lean();
    const totalRecords = await User.countDocuments(query);

    return {
      data: users,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    };
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getUsersByStatus = async (
  status,
  selectedFields,
  page = 1,
  limit = 10,
  search = ""
) => {
  try {
    page = Number.parseInt(page);
    limit = Number.parseInt(limit);
    const skip = (page - 1) * limit;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .select(selectedFields)
      .skip(skip)
      .limit(limit)
      .lean();
    const totalRecords = await User.countDocuments(query);

    return {
      data: users,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    };
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getNearbyUsers = async (
  userId,
  userLocation,
  swipedIds,
  mode,
  skip,
  limit
) => {
  return User.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: userLocation.coordinates,
        },
        distanceField: "distance",
        spherical: true,
        key: `profiles.${mode}.location`,
      },
    },
    {
      $match: {
        _id: { $ne: new mongoose.Types.ObjectId(userId) },
        status: "Active",
        // [`profiles.${mode}.profileStep`]: "completed",
        _id: { $nin: swipedIds.map((id) => new mongoose.Types.ObjectId(id)) },
      },
    },
    {
      $project: {
        _id: 1,
        distance: 1,
        phone: 1,
        // [`profiles.${mode}`]: 1,
        profile: `$profiles.${mode}`,
      },
    },
    {
      $lookup: {
        from: "quizzes", // collection name
        let: { creatorId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$createdBy", "$$creatorId"] },
              status: "Active", // only active quizzes
            },
          },
          {
            $project: {
              _id: 1,
              title: 1,
              description: 1,
              createdBy: 1,
              status: 1,
            },
          },
        ],
        as: "quizzes",
      },
    },
    {
      $lookup: {
        from: "swipes",
        let: {
          targetId: "$_id",
          currentUserId: new mongoose.Types.ObjectId(userId),
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$userId", "$$currentUserId"] },
                  { $eq: ["$targetId", "$$targetId"] },
                  { $eq: ["$action", "like"] },
                ],
              },
            },
          },
          { $limit: 1 }, // only need one match
        ],
        as: "mySwipe",
      },
    },
    {
      $addFields: {
        alreadyLiked: { $gt: [{ $size: "$mySwipe" }, 0] },
      },
    },
    { $project: { mySwipe: 0 } },
    { $skip: skip },
    { $limit: Number(limit) },
  ]);
};

exports.getPassedQuizProfiles = async (userId, userLocation, mode, threshold, skip, limit) => {
  return User.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: userLocation.coordinates,
        },
        distanceField: "distance",
        spherical: true,
        key: `profiles.${mode}.location`, // mode-based location (quiz/snatched/versus)
      },
    },
    {
      $match: {
        _id: { $ne: new mongoose.Types.ObjectId(userId) }, // exclude self
        status: "Active",
        [`profiles.${mode}.quizScore`]: { $gte: threshold }, // ✅ only pass %
        [`profiles.${mode}.profileStep`]: "completed", // only completed profiles
      },
    },
    {
      $project: {
        _id: 1,
        distance: 1,
        phone: 1,
        profile: `$profiles.${mode}`, // flatten profile
      },
    },
    {
      $lookup: {
        from: "quizzes",
        let: { creatorId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$createdBy", "$$creatorId"] },
              status: "Active",
            },
          },
          { $project: { _id: 1, title: 1, description: 1, status: 1 } },
        ],
        as: "quizzes",
      },
    },
    { $skip: skip },
    { $limit: Number(limit) },
  ]);
};