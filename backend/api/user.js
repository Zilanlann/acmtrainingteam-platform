import express from "express";
import query from "../dbQuery.js";
import { result, error } from "./tools/apiDataFormat.js";

const router = express.Router();

async function adminAuth(password) {
  const selectPassword = await query(
    `SELECT password FROM user WHERE id = 9999`
  );
  return password && password === selectPassword[0]?.password;
}

// $route  POST api/user/register
// @access public
router.post("/register", async (req, res) => {
  try {
    await query(`INSERT INTO user SET ?`, req.body);
    res.json(result(`User ${req.body.name} has registered successfully.`));
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

// $route  POST api/user/signin
// @access public
router.post("/signin", async (req, res) => {
  try {
    if (!(req.body.type && req.body.password && req.body.usernameOrEmail)) {
      res.json(error(`Data is not in the correct format.`));
      return;
    }
    const selectResult = await query(
      `SELECT id, name, password FROM user WHERE ?? = ?`,
      [req.body.type, req.body.usernameOrEmail]
    );
    if (selectResult.length === 0) {
      res.json(error("This user has not registered."));
      return;
    }
    if (selectResult[0].password === req.body.password) {
      res.json(result(selectResult[0]));
    } else {
      res.json(error("The password is not correct."));
    }
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

// $route  POST api/user/info
// @access public
router.post("/info", async (req, res) => {
  if (!req.body.user_name) {
    res.json(error(`Data is not in the correct format.`));
    return;
  }
  try {
    const user = (
      await query(
        `SELECT id, name, email, qq, about, codeforces_handle, codeforces_avatar,
			leetcode_handle, leetcode_avatar FROM user WHERE name = '${req.body.user_name}'`
      )
    )[0];

    const userNumber = (
      await query(`SELECT COUNT(*) as number FROM user`, req.body)
    )[0].number;

    const id = user.id;

    const following = await query(
      `SELECT DISTINCT name, email, codeforces_handle, leetcode_handle,
			u.id, codeforces_avatar, leetcode_avatar
		  FROM user u, user_list ul, list_user lu
			WHERE ul.user_id = ${id} AND ul.id = lu.list_id AND lu.user_id = u.id`
    );

    const followers = await query(
      `SELECT DISTINCT name, email, codeforces_handle, leetcode_handle,
			u.id, codeforces_avatar, leetcode_avatar
		  FROM user u, user_list ul, list_user lu
			WHERE ul.user_id = u.id AND ul.id = lu.list_id AND lu.user_id = ${id}`
    );

    const submissionStatus = (
      await query(`SELECT * FROM user_daily_status WHERE user_Id = ${id};`)
    )[0];

    const calendarBeginTimestamp = new Date().getTime() / 1000 - 183 * 86400;

    const calendarSubmissions = (
      await query(
        `SELECT submit_time FROM submission WHERE user_Id = ${id} 
				AND status = 'Accepted' AND submit_time > ${calendarBeginTimestamp};`
      )
    ).map((item) => {
      return item.submit_time;
    });

    const allUserSubmissionStatus = (
      await query(`SELECT AVG(active_score) average_active_score,
      AVG(week_ac_submission_number) average_week_ac_submission_number,
      AVG(week_average_ac_rating) average_week_average_ac_rating,
      AVG(month_ac_submission_number) average_month_ac_submission_number,
      AVG(month_average_ac_rating) average_month_average_ac_rating,
      MAX(active_score) max_active_score,
      MAX(week_ac_submission_number) max_week_ac_submission_number,
      MAX(week_average_ac_rating) max_week_average_ac_rating,
      MAX(month_ac_submission_number) max_month_ac_submission_number,
      MAX(month_average_ac_rating) max_month_average_ac_rating
			FROM user_daily_status;`)
    )[0];

    res.json(
      result({
        user,
        userNumber,
        following,
        followers,
        submissionStatus,
        calendarSubmissions,
        allUserSubmissionStatus,
      })
    );
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

// $route  POST api/user/update
// @access private or admin
router.post("/update", async (req, res) => {
  try {
    if (!(req.body.auth && req.body.info)) {
      res.json(error(`Data is not in the correct format.`));
      return;
    }
    const selectResult = await query(
      `SELECT id, password FROM user WHERE id = ${req.body.auth.id}`
    );
    if (
      selectResult.length === 0 ||
      selectResult[0].password !== req.body.auth.password ||
      (req.body.auth.id !== 9999 && req.body.auth.name !== req.body.info.name)
    ) {
      res.json(error("Wrong authorization."));
      return;
    }
    await query(
      `UPDATE user SET ? WHERE name = '${req.body.info.name}'`,
      req.body.info
    );
    res.json(
      result(`Information of ${req.body.info.name} has updated successfully.`)
    );
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

// $route  POST api/user/import
// @access admin
router.post("/import", async (req, res) => {
  const authResult = await adminAuth(req.body.auth?.password);
  if (!authResult) {
    res.json(error(`Authorization error.`));
    return;
  }
  if (!(req.body.data?.length)) {
    res.json(error(`Data is not in the correct format.`));
    return;
  }
  console.log(req.body.data);
  const successfulRow = [];
  const failedRow = [];
  for (const row of req.body.data) {
    try {
      if (!row.password) {
        row.password = "123456";
      }
      if (!row.name) {
        if (row.codeforces_handle) {
          row.name = row.codeforces_handle;
        }
        if (row.leetcode_handle) {
          row.name = row.leetcode_handle;
        }
      }
      await query(`INSERT INTO user SET ?`, row);
      successfulRow.push(row.name);
    } catch (err) {
      failedRow.push(row.name);
    }
  }
  res.json(
    result(`Successful/Failed: ${successfulRow.length}/${failedRow.length}
						Successful: ${successfulRow}
						Failed: ${failedRow}`)
  );
});

// $route  POST api/user/getall
// @access public
router.post("/getall", async (req, res) => {
  try {
    const selectResult =
      await query(`SELECT id, name, codeforces_handle, codeforces_avatar,
			leetcode_handle, leetcode_avatar FROM user`);
    res.json(result(selectResult));
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

// $route  POST api/user/delete
// @access public
router.post("/delete", async (req, res) => {
  try {
    const authResult = await adminAuth(req.body.auth?.password);
    if (!authResult) {
      res.json(error(`Authorization error.`));
      return;
    }
    const userId = req.body.userId;
    await query(`DELETE FROM user WHERE id = ${userId};`);
    await query(`DELETE FROM user_daily_status WHERE user_id = ${userId};`);
    await query(`DELETE FROM submission WHERE user_id = ${userId};`);
    await query(`DELETE FROM user_list WHERE user_id = ${userId};`);
    await query(`DELETE FROM list_user WHERE user_id = ${userId};`);
    res.json(result(`Delete successfully!`));
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

export default router;
