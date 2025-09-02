const logger = require("@/utils/logger/logger.utils");
const QuizAttempt = require("../model/attemptQuiz.model");

exports.createAttempt = async (doc) => {
  try {
    const attempt = new QuizAttempt(doc);
    return await attempt.save();
  } catch (err) {
    logger.error(`createAttempt error: ${err.message}`, { stack: err.stack });
    throw err;
  }
};

exports.listAttemptsByUser = async ({ userId, page = 1, limit = 10 }) => {
  try {
    page = Number(page); limit = Number(limit);
    const skip = (page - 1) * limit;

    const [data, totalRecords] = await Promise.all([
      QuizAttempt.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      QuizAttempt.countDocuments({ userId }),
    ]);

    return {
      data,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    };
  } catch (err) {
    logger.error(`listAttemptsByUser error: ${err.message}`, { stack: err.stack });
    throw err;
  }
};
