export default class CodeforcesStoring {
  static initializeConnection(connection) {
    this.connection = connection;
  }

  static async storeSubmissions(submissionArray) {
    const query =
      `INSERT IGNORE INTO codeforces_submission 
		(submission_id, user_id, submit_time, codeforces_problem_id, status)
		VALUES ` + this.connection.escape(submissionArray);
    return await this.connection.query(query);
  }

  static async storeProblems(problemArray) {
    const query =
      `INSERT IGNORE INTO codeforces_problem
		(codeforces_problem_id, title, rating)
		VALUES ` + this.connection.escape(problemArray);
    return await this.connection.query(query);
  }

  static async storeTags(tagArray) {
    const query =
      `INSERT IGNORE INTO problem_tag
	 	(codeforces_problem_id, tag)
	 	VALUES ` + this.connection.escape(tagArray);
    return await this.connection.query(query);
  }
}
