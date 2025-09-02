const logger = require("@/utils/logger/logger.utils");
const Quiz = require("../model/userQuiz.model");

exports.createQuiz = async (doc) => {
  try {
    const quiz = new Quiz(doc);
    return await quiz.save();
  } catch (err) {
    logger.error(`createQuiz error: ${err.message}`, { stack: err.stack });
    throw err;
  }
};

exports.getQuizById = async (id, { stripAnswers = false } = {}) => {
  try {
    const projection = {};
    const quiz = await Quiz.findById(id).lean();
    if (!quiz) return null;
    if (stripAnswers) {
      // remove correctAnswers before sending to takers
      quiz.questions = quiz.questions.map(q => {
        const { correctAnswers, ...rest } = q;
        return rest;
      });
    }
    return quiz;
  } catch (err) {
    logger.error(`getQuizById error: ${err.message}`, { stack: err.stack });
    throw err;
  }
};

exports.listQuizzes = async ({ createdBy, page = 1, limit = 10, status, search = "" }) => {
  try {
    page = Number(page); limit = Number(limit);
    const skip = (page - 1) * limit;

    const query = {};
    if (createdBy) query.createdBy = createdBy;
    if (status) query.status = status;
    if (search) query.title = { $regex: search, $options: "i" };

    const [data, totalRecords] = await Promise.all([
      Quiz.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Quiz.countDocuments(query),
    ]);

    return {
      data,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    };
  } catch (err) {
    logger.error(`listQuizzes error: ${err.message}`, { stack: err.stack });
    throw err;
  }
};

exports.updateQuizStatus = async (id, status) => {
  try {
    return await Quiz.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, lean: true }
    );
  } catch (err) {
    logger.error(`updateQuizStatus error: ${err.message}`, { stack: err.stack });
    throw err;
  }
};
