// Transform original data to fit the format of database
const LEETCODE_STATUS_TRANSFORMER = {
  A_10: 'OK',
  A_11: 'WRONG_ANSWER',
  A_12: 'MEMORY_LIMIT_EXCEEDED',
  A_13: 'OUTPUT_LIMIT_EXCEEDED',
  A_14: 'TIME_LIMIT_EXCEEDED',
  A_15: 'RUNTIME_ERROR',
  A_16: 'IE',
  A_20: 'COMPILATION_ERROR',
  A_30: 'TO'
};

const DIFFICULTY_RATING_TRANSFORMER = {
  Easy: 800,
  Medium: 1200,
  Hard: 1600
};

export default class LeetCodeTransformer {
  static transformSubmissions(submissionArray, userId) {
    const leetCodeSubmission = [];
    const leetCodeProblem = [];
    const problemSet = new Set();
    const problemTag = [];

    for (const submission of submissionArray) {
      if (!submission?.status) {
        continue;
      }

      leetCodeSubmission.push([parseInt(submission.submission_id), userId, submission.submit_time, parseInt(submission.problem?.problem_id), LEETCODE_STATUS_TRANSFORMER[submission.status]]);

      if (problemSet.has(submission.problem?.problem_id)) {
        continue;
      }

      leetCodeProblem.push([submission.problem?.problem_id, submission.problem?.title, submission.problem?.title_slug, DIFFICULTY_RATING_TRANSFORMER[submission.problem?.difficulty]]);
      problemSet.add(submission.problem?.problem_id);

      for (const tag of submission.problem?.tags) {
        problemTag.push([submission.problem?.problem_id, tag.name]);
      }
    }

    return {
      leetCodeSubmission,
      leetCodeProblem,
      problemTag
    };
  }
}
