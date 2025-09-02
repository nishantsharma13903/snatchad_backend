const logger = require("@/utils/logger/logger.utils");
const SuggestedQuestion = require("../model/suggestedQuestion.model");

exports.createSuggestedQuestion = async (question) => {
  try {
    const newSuggestedQuestion = new SuggestedQuestion({ question });
    return await newSuggestedQuestion.save();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getSuggestedQuestionById = async (id) => {
  try {
    const question = await SuggestedQuestion.findOne({ _id: id }).lean();
    return question;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getSuggestedQuestionByName = async (question) => {
  try {
    const existingSuggestedQuestion = await SuggestedQuestion.findOne({
      question: { $regex: new RegExp(`^${question}$`, "i") },
    });
    return existingSuggestedQuestion;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getAllSuggestedQuestion = async (
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
      query.question = { $regex: search, $options: "i" };
    }

    const suggestedQuestions = await SuggestedQuestion.find(query)
      .sort({ question: 1 })
      .skip(skip)
      .limit(limit)
      .select(selectedFields)
      .lean();

    const totalRecords = await SuggestedQuestion.countDocuments(query);

    return {
      data: suggestedQuestions,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    };
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.updateSuggestedQuestionById = async (id, payload) => {
  try {
    const updatedSuggestedQuestion = await SuggestedQuestion.findByIdAndUpdate(
      id,
      {
        $set: payload,
      }
    );
    return updatedSuggestedQuestion;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.checkSuggestedQuestionExistance = async (question) => {
  try {
    const isExist = await SuggestedQuestion.findOne({
      question: { $regex: new RegExp(`^${question}$`, "i") }, // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.checkSuggestedQuestionExistanceForUpdate = async (question, id) => {
  try {
    const isExist = await SuggestedQuestion.findOne({
      question: { $regex: new RegExp(`^${question}$`, "i") },
      _id: { $ne: id },
      status: "Active", // case-insensitive match
    });
    return !!isExist; // returns true/false
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};

exports.deleteSuggestedQuestionByName = async (question, id) => {
  try {
    return await SuggestedQuestion.deleteMany({
      question: { $regex: new RegExp(`^${question}$`, "i") },
      status: "Delete",
    });
  } catch (error) {
    logger.error("Error", error);
    throw error; // rethrow so caller knows
  }
};
