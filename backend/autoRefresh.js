import connection from "./dbConnection.js";
import {
  LeetCodeUser,
  LeetCodeTransformer,
  CodeforcesUser,
  CodeforcesTransformer,
} from "./dataGetting/index.js";

// Codeforces refreshing
async function refreshCodeforces() {
  const codeforcesRow = await connection.query(
    "SELECT id, codeforces_handle FROM user WHERE codeforces_handle is not NULL"
  );
  codeforcesRow.forEach((row, index) => {
    setTimeout(async () => {
      const user = new CodeforcesUser(row.codeforces_handle);
      try {
        const submissionList = await user.getSubmissionList();

        const { codeforcesSubmission, codeforcesProblem, problemTag } =
          CodeforcesTransformer.transformSubmissions(submissionList, row.id);

        const submissionQuery = `INSERT INTO submission 
				(submission_id, user_id, submit_time, codeforces_problem_id, status, rating)
				VALUES ${connection.escape(codeforcesSubmission)} ON DUPLICATE KEY UPDATE
				rating = VALUES(rating), status = VALUES(status);`;
        connection.query(submissionQuery);

        const problemQuery = `INSERT INTO problem
				(codeforces_problem_id, title, rating, tags)
				VALUES ${connection.escape(codeforcesProblem)}
				ON DUPLICATE KEY UPDATE rating = VALUES(rating),
				tags = VALUES(tags);`;
        connection.query(problemQuery);

        const tagQuery =
          `INSERT IGNORE INTO problem_tag
	 			(codeforces_problem_id, tag)
	 			VALUES ` + connection.escape(problemTag);
        connection.query(tagQuery);

        console.log(`Codeforces: ${row.codeforces_handle}`);
			} catch (err) {
				console.error(`ERROR of Codeforces: ${row.codeforces_handle}`);
        console.error(err);
      }
    }, index * 2000);
  });
}

// LeetCode refreshing
async function refreshLeetcode() {
  const leetcodeRow = await connection.query(
    "SELECT id, leetcode_handle FROM user WHERE leetcode_handle is not NULL"
  );

  leetcodeRow.forEach(async (row) => {
    const user = new LeetCodeUser(row.leetcode_handle);
    try {
      const submissionList = await user.getRecentSubmissionList();

      const { leetCodeSubmission, leetCodeProblem, problemTag } =
        LeetCodeTransformer.transformSubmissions(submissionList, row.id);

      const submissionQuery = `INSERT INTO submission 
		(submission_id, user_id, submit_time, leetcode_problem_id, status, rating)
		VALUES  ${connection.escape(leetCodeSubmission)} ON DUPLICATE KEY UPDATE
		rating = VALUES(rating), status = VALUES(status)`;
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

      console.log(`LeetCode: ${row.leetcode_handle}`);
		} catch (err) {
			console.error(`ERROR of LeetCode: ${row.leetcode_handle}`);
      console.error(err);
    }
  });
}

// Update user_daily
async function refreshUserDaily() {
  // 30 days
  const monthBeginTimestamp = parseInt(Date.now() / 1000) - 86400 * 30;
  // 7 days
  const weekBeginTimestamp = parseInt(Date.now() / 1000) - 86400 * 7;

  const countSubmissionQuery = `SELECT COUNT(*) AS submissionNumber FROM submission 
	WHERE user_id = ${row.id}`;
  const submissionNumber = (await connection.query(countSubmissionQuery))[0].submissionNumber;
  console.log(submissionNumber);
  const recentAcSubmissionQuery = `SELECT submit_time, rating FROM view_submission_problem
	WHERE user_id = ${row.id} AND submit_time > ${weekBeginTimestamp} 
	AND status = 'Accepted'`;

  let activeScore = 0;
  const submissionArray = await connection.query(recentAcSubmissionQuery);
  for (const submission of submissionArray) {
    activeScore +=
      (submission.rating * (submission.submit_time - weekBeginTimestamp)) / (800 * 86400);
  }
  const updateQuery = `INSERT INTO user_daily SET ?
	ON DUPLICATE KEY UPDATE active_score = VALUES(active_score),
	submission_number = VALUES(submission_number)`;
  await connection.query(updateQuery, {
    user_id: row.id,
    active_score: activeScore,
    submission_number: submissionNumber,
  });
  console.log(`${row.id} submission:${submissionNumber} score:${activeScore}`);
}

refreshCodeforces();
refreshLeetcode();
// await refreshUserDaily();
