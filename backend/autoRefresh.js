import connection from "./dbConnection.js";
import {
  LeetCodeUser,
  LeetCodeTransformer,
  CodeforcesUser,
  CodeforcesTransformer,
} from "./dataGetting/index.js";

// Codeforces refreshing
const codeforcesRow = await connection.query(
  "SELECT id, codeforces_handle FROM user WHERE codeforces_handle is not NULL"
);

for (const row of codeforcesRow) {
  const user = new CodeforcesUser(row.codeforces_handle);
  const submissionList = await user.getSubmissionList();

  const { codeforcesSubmission, codeforcesProblem, problemTag } =
    CodeforcesTransformer.transformSubmissions(submissionList, row.id);

  const submissionQuery =
    `INSERT IGNORE INTO submission 
		(submission_id, user_id, submit_time, codeforces_problem_id, status)
		VALUES ` + connection.escape(codeforcesSubmission);
  connection.query(submissionQuery);

  const problemQuery =
    `INSERT IGNORE INTO problem
		(codeforces_problem_id, title, rating, tags)
		VALUES ` + connection.escape(codeforcesProblem);
  connection.query(problemQuery);

  const tagQuery =
    `INSERT IGNORE INTO problem_tag
	 	(codeforces_problem_id, tag)
	 	VALUES ` + connection.escape(problemTag);
  connection.query(tagQuery);
}

// LeetCode refreshing
const leetcodeRow = await connection.query(
  "SELECT id, leetcode_handle FROM user WHERE leetcode_handle is not NULL"
);

for (const row of leetcodeRow) {
  const user = new LeetCodeUser(row.leetcode_handle);
  const submissionList = await user.getRecentSubmissionList();

  const { leetCodeSubmission, leetCodeProblem, problemTag } =
    LeetCodeTransformer.transformSubmissions(submissionList, row.id);

  const submissionQuery =
    `INSERT IGNORE INTO submission 
		(submission_id, user_id, submit_time, leetcode_problem_id, status)
		VALUES ` + connection.escape(leetCodeSubmission);
  connection.query(submissionQuery);

  const problemQuery =
    `INSERT IGNORE INTO problem
		(leetcode_problem_id, title, title_slug, rating, tags)
		VALUES ` + connection.escape(leetCodeProblem);
  connection.query(problemQuery);

  const tagQuery =
    `INSERT IGNORE INTO problem_tag
	 	(leetcode_problem_id, tag)
	 	VALUES ` + connection.escape(problemTag);
  connection.query(tagQuery);
}
