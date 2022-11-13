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
  static transformLeetCodeSubmission(submission) {
    if (!submission) {
      throw new Error(`Submission is abnormal: ${submission}`);
    }

    return {
      leetcode_submission: {
        submission_id: submission.id,
        submit_time: submission.submitTime,
        status: LEETCODE_STATUS_TRANSFORMER[submission.status]
      },
      leetcode_problem: submission.question
    };
  }

  static transformLeetCodeSubmissions(submissionArray) {
    result = [];
    for (const submission of submissionArray) {
      if (!submission?.status) {
        continue;
      }
      result.append(DataTransformer.transformLeetCodeSubmission(submission));
    }
    return result;
  }
}
