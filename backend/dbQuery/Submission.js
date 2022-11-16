import connection from './connection.js';

export default class Submission {
  async getSubmission(condition) {
    const query =
      `SELECT id, submission_id, user_id, leetcode_problem_id, submit_time, status
		FROM leetcode_submission WHERE ${connection.escape(condition)};
		`
    return connection.query(query);
  }
}
