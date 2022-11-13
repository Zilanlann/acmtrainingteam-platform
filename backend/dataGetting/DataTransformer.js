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

export default class DataTransformer {
  static transformLeetCodeSubmissions(submissionArray, userId) {
    const leetCodeSubmission = [];
    const leetCodeProblem = [];
    const problemSet = new Set();
    const problemTag = [];

    for (const submission of submissionArray) {
      if (!submission?.status) {
        continue;
      }

      leetCodeSubmission.push({
        submission_id: submission.submission_id,
        user_id: userId,
        submit_time: submission.submit_time,
        problem_id: submission.problem?.problem_id,
        status: LEETCODE_STATUS_TRANSFORMER[submission.status]
      });

      if (problemSet.has(submission.problem?.problem_id)) {
        continue;
      }

      leetCodeProblem.push({
        problem_id: submission.problem?.problem_id,
        title: submission.problem?.title,
        tilte_slug: submission.problem?.title_slug,
        difficulty: submission.problem?.difficulty
      });
      problemSet.add(submission.problem?.problem_id);

      for (const tag of submission.problem?.tags) {
        problemTag.push({
          platform: 'LeetCode',
          problem_id: submission.problem?.problem_id,
          tag: tag.name
        });
      }
    }

    return {
      leetCodeSubmission,
      leetCodeProblem,
      problemTag
    };
  }
}
