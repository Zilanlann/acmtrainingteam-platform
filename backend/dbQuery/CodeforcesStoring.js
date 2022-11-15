import connection from './connection.js';

export default class CodeforcesStoring {
  static async storeSubmissions(submissionArray) {
    const query =
      `INSERT IGNORE INTO codeforces_submission 
		(submission_id, user_id, submit_time, codeforces_problem_id, status)
		VALUES ` + connection.escape(submissionArray);
    return connection.query(query);
  }

  static async storeProblems(problemArray) {
    const query =
      `INSERT IGNORE INTO codeforces_problem
		(codeforces_problem_id, title, rating)
		VALUES ` + connection.escape(problemArray);
    return connection.query(query);
  }

  static async storeTags(tagArray) {
    const query =
      `INSERT IGNORE INTO problem_tag
	 	(codeforces_problem_id, tag)
	 	VALUES ` + connection.escape(tagArray);
    return connection.query(query);
  }
}
