export default class LeetCodeStoring {
  static initializeConnection(connection) {
    this.connection = connection;
  }

  static async storeSubmissions(submissionArray) {
    const query =
      `INSERT IGNORE INTO leetcode_submission 
		(submission_id, user_id, submit_time, leetcode_problem_id, status)
		VALUES ` + this.connection.escape(submissionArray);
    return await this.connection.query(query);
  }

  static async storeProblems(problemArray) {
    const query =
      `INSERT IGNORE INTO leetcode_problem
		(leetcode_problem_id, title, title_slug, difficulty)
		VALUES ` + this.connection.escape(problemArray);
    return await this.connection.query(query);
  }

  static async storeTags(tagArray) {
    const query =
      `INSERT IGNORE INTO problem_tag
	 	(leetcode_problem_id, tag)
	 	VALUES ` + this.connection.escape(tagArray);
    return await this.connection.query(query);
  }
}
