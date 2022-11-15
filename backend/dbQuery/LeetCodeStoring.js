import connection from './connection.js';

export default class LeetCodeStoring {
  static async storeSubmissions(submissionArray) {
    const query =
      `INSERT IGNORE INTO leetcode_submission 
		(submission_id, user_id, submit_time, leetcode_problem_id, status)
		VALUES ` + connection.escape(submissionArray);
    return connection.query(query);
  }

  static async storeProblems(problemArray) {
    const query =
      `INSERT IGNORE INTO leetcode_problem
		(leetcode_problem_id, title, title_slug, difficulty)
		VALUES ` + connection.escape(problemArray);
    return connection.query(query);
  }

  static async storeTags(tagArray) {
    const query =
      `INSERT IGNORE INTO problem_tag
	 	(leetcode_problem_id, tag)
	 	VALUES ` + connection.escape(tagArray);
    return connection.query(query);
  }
}
