import connection from "./dbConnection.js";
import {
  LeetCodeUser,
  LeetCodeTransformer,
  CodeforcesUser,
  CodeforcesTransformer,
  Avatar,
} from "./dataGetting/index.js";

async function logError(errorObject) {
  try {
    await connection.query(`INSERT INTO error_log SET ?`, errorObject);
  } catch (err) {
    console.error(err);
  }
}

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
        if (!submissionList.length) {
          return;
        }

        const { codeforcesSubmission, codeforcesProblem, problemTag } =
          CodeforcesTransformer.transformSubmissions(submissionList, row.id);

        const submissionQuery = `INSERT INTO submission 
				(submission_id, user_id, submit_time, codeforces_problem_id, status, rating)
				VALUES ${connection.escape(codeforcesSubmission)} ON DUPLICATE KEY UPDATE
				rating = VALUES(rating), status = VALUES(status);`;

        await connection.query(submissionQuery);

        const problemQuery = `INSERT INTO problem
				(codeforces_problem_id, title, rating, tags)
				VALUES ${connection.escape(codeforcesProblem)}
				ON DUPLICATE KEY UPDATE rating = VALUES(rating),
				tags = VALUES(tags);`;
        await connection.query(problemQuery);

        const tagQuery =
          `INSERT IGNORE INTO problem_tag
	 			(codeforces_problem_id, tag)
	 			VALUES ` + connection.escape(problemTag);
        await connection.query(tagQuery);

        console.log(`Codeforces: ${row.codeforces_handle}`);
      } catch (err) {
        console.error(`ERROR of Codeforces: ${row.codeforces_handle}`);
        console.error(err);
        logError({
          action: `Refresh Codeforces Submissions`,
          platform: `Codeforces`,
          handle: row.codeforces_handle,
          error: err,
        });
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
      if (!submissionList.length) {
        return;
      }

      const { leetCodeSubmission, leetCodeProblem, problemTag } =
        LeetCodeTransformer.transformSubmissions(submissionList, row.id);

      const submissionQuery = `INSERT INTO submission 
		(submission_id, user_id, submit_time, leetcode_problem_id, status, rating)
		VALUES  ${connection.escape(leetCodeSubmission)} ON DUPLICATE KEY UPDATE
		rating = VALUES(rating), status = VALUES(status)`;
      await connection.query(submissionQuery);

      const problemQuery =
        `INSERT IGNORE INTO problem
		(leetcode_problem_id, title, title_slug, rating, tags)
		VALUES ` + connection.escape(leetCodeProblem);
      await connection.query(problemQuery);

      const tagQuery =
        `INSERT IGNORE INTO problem_tag
	 	(leetcode_problem_id, tag)
	 	VALUES ` + connection.escape(problemTag);
      await connection.query(tagQuery);

      console.log(`LeetCode: ${row.leetcode_handle}`);
    } catch (err) {
      console.error(`ERROR of LeetCode: ${row.leetcode_handle}`);
      console.error(err);
      logError({
        action: `Refresh LeetCode Submissions`,
        platform: `LeetCode`,
        handle: row.leetcode_handle,
        error: err,
      });
    }
  });
}

async function refreshUserDailyStatus() {
  try {
    await connection.query(`CALL refresh_user_daily_status`);
    console.log("Refresh user_daily_status successfully.");
  } catch (err) {
    console.error(err);
    logError({
      action: `Refresh user daily status`,
      error: err,
    });
  }
}

async function refreshLeetcodeAvatar() {
  const leetcodeRow = await connection.query(
    "SELECT id, leetcode_handle FROM user WHERE leetcode_handle is not NULL"
  );
  leetcodeRow.forEach(async (row) => {
    try {
      const leetcodeAvatar = await Avatar.getLeetcodeUserAvatar(
        row.leetcode_handle
      );
      await connection.query(
        `UPDATE user SET leetcode_avatar = '${leetcodeAvatar}'
			WHERE leetcode_handle = '${row.leetcode_handle}'`
      );
      console.log(`${row.leetcode_handle}: ${leetcodeAvatar}`);
    } catch (err) {
      console.error(`ERROR of LeetCode: ${row.leetcode_handle}`);
      console.error(err);
      logError({
        action: `Get LeetCode Avatar`,
        platform: `LeetCode`,
        handle: row.leetcode_handle,
        error: err,
      });
    }
  });
}

async function refreshCodeforcesAvatar() {
  try {
    const codeforcesRow = await connection.query(
      "SELECT codeforces_handle FROM user WHERE codeforces_handle is not NULL"
    );
    codeforcesRow.forEach((row, index) => {
      setTimeout(async () => {
        try {
          const handle = row.codeforces_handle;
          const avatar = await Avatar.getCodeforcesUserAvatar(handle);
          await connection.query(`UPDATE user SET codeforces_avatar = '${avatar}'
        	WHERE codeforces_handle = '${handle}'`);
          console.log(`Avatar: ${handle} ${avatar}`);
        } catch (err) {
          console.error(`ERROR of Codeforces Avatar: ${row.codeforces_handle}`);
          console.error(err);
          logError({
            action: `Get Codeforces Avatar`,
            platform: `Codeforces`,
            handle: row.codeforces_handle,
            error: err,
          });
        }
      }, index * 2000);
    });
  } catch (err) {
    console.error(err);
  }
}

function refreshAll() {
  refreshCodeforces();
  refreshLeetcode();
  refreshLeetcodeAvatar();
  refreshCodeforcesAvatar();
  setTimeout(() => {
    refreshUserDailyStatus();
  }, 200000);
}

export { refreshCodeforces, refreshLeetcode, refreshUserDailyStatus, refreshCodeforcesAvatar, refreshLeetcodeAvatar, refreshAll };