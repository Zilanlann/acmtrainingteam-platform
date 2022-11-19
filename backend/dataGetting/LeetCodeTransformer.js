// Transform original data to fit the format of database
const LEETCODE_STATUS_TRANSFORMER = {
  A_10: "Accepted",
  A_11: "Wrong Answer",
  A_12: "Memory Limit Exceeded",
  A_13: "Output Limit Exceeded",
  A_14: "Time Limit Exceeded",
  A_15: "Runtime Error",
  A_16: "IE",
  A_20: "Compilation Error",
  A_30: "TO",
};

const DIFFICULTY_RATING_TRANSFORMER = {
  Easy: 800,
  Medium: 1200,
  Hard: 1600,
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

      leetCodeSubmission.push([
        parseInt(submission.submission_id),
        userId,
        submission.submit_time,
        parseInt(submission.problem?.problem_id),
        LEETCODE_STATUS_TRANSFORMER[submission.status],
      ]);

      if (problemSet.has(submission.problem?.problem_id)) {
        continue;
      }

      const tags = [];
      for (const tag of submission.problem?.tags) {
        const tagName = tag.name.toLowerCase();
        problemTag.push([submission.problem?.problem_id, tagName]);
        tags.push(tagName);
      }

      leetCodeProblem.push([
        submission.problem?.problem_id,
        submission.problem?.title,
        submission.problem?.title_slug,
        DIFFICULTY_RATING_TRANSFORMER[submission.problem?.difficulty],
        tags.toString(),
      ]);
      problemSet.add(submission.problem?.problem_id);
    }

    return {
      leetCodeSubmission,
      leetCodeProblem,
      problemTag,
    };
  }
}
