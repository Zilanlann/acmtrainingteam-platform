// Transform original data to fit the format of database
const CODEFORCES_STATUS_TRANSFORMER = {
  OK: "Accepted",
  WRONG_ANSWER: "Wrong Answer",
  MEMORY_LIMIT_EXCEEDED: "Memory Limit Exceeded",
  TIME_LIMIT_EXCEEDED: "Time Limit Exceeded",
  RUNTIME_ERROR: "Runtime Error",
  COMPILATION_ERROR: "Compilation Error",
  SKIPPED: "Skipped",
  PRESENTATION_ERROR: "Presentation Error",
  FAILED: "Failed",
  PARTIAL: "Partial",
  IDLENESS_LIMIT_EXCEEDED: "Idleness Limit Exceeded",
  SECURITY_VIOLATED: "Security Violated",
  CRASHED: "Crashed",
  INPUT_PREPARATION_CRASHED: "Input Preparation Crashed",
  CHALLENGED: "Challenged",
  REJECTED: "Rejected",
};

export default class CodeforcesTransformer {
  static transformSubmissions(submissionArray, userId) {
    const codeforcesSubmission = [];
    const codeforcesProblem = [];
    const problemSet = new Set();
    const problemTag = [];

    for (const submission of submissionArray) {
      if (submission.verdict === "TESTING") {
        continue;
      }
      const problemId = `${submission.problem.contestId}/${submission.problem.index}`;
      codeforcesSubmission.push([
        submission.id,
        userId,
        submission.creationTimeSeconds,
        problemId,
        CODEFORCES_STATUS_TRANSFORMER[submission.verdict],
      ]);

      if (problemSet.has(submission.problem?.problem_id)) {
        continue;
      }

      for (const tag of submission.problem?.tags) {
        problemTag.push([problemId, tag]);
      }

      codeforcesProblem.push([
        problemId,
        submission.problem?.name,
        submission.problem?.rating,
        submission.problem?.tags.toString(),
      ]);
      problemSet.add(problemId);
    }

    return {
      codeforcesSubmission,
      codeforcesProblem,
      problemTag,
    };
  }
}
