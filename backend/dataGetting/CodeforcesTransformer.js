// Transform original data to fit the format of database
export default class CodeforcesTransformer {
  static transformSubmissions(submissionArray, userId) {
    const codeforcesSubmission = [];
    const codeforcesProblem = [];
    const problemSet = new Set();
    const problemTag = [];

    for (const submission of submissionArray) {
      if (submission.verdict === 'TESTING') {
        continue;
      }
      const problemId = `${submission.problem.contestId}/${submission.problem.index}`;
      codeforcesSubmission.push([submission.id, userId, submission.creationTimeSeconds, problemId, submission.verdict]);

      if (problemSet.has(submission.problem?.problem_id)) {
        continue;
      }

      codeforcesProblem.push([problemId, submission.problem?.name, submission.problem?.rating]);
      problemSet.add(problemId);

      for (const tag of submission.problem?.tags) {
        problemTag.push([problemId, tag]);
      }
    }

    return {
      codeforcesSubmission,
      codeforcesProblem,
      problemTag
    };
  }
}