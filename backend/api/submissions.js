import express from "express";
import connection from "../dbConnection.js";
import { result, error } from "./tools/apiDataFormat.js";

const router = express.Router();

// $route  POST api/submissions
// @access public
router.post("/", async (req, res) => {
  if (!(req.body.condition && req.body.page)) {
    res.json(error(`Data is not in the correct format.`));
    return;
  }
  try {
    const queryResult = await connection.query(
      `SELECT submission_id, leetcode_problem_id, codeforces_problem_id, user_id,
       user_name, submit_time, status, title, title_slug, rating, tags
			 FROM view_submission_problem WHERE ?
			 LIMIT ${15 * (req.body.page - 1)}, 15`,
      req.body.condition
    );
    res.json(result(queryResult));
  } catch (error) {
    console.error(error);
    res.json(error(error));
  }
});

// $route  POST api/submissions/number
// @access public
router.post("/number", async (req, res) => {
  if (!req.body.condition) {
    res.json(error(`Data is not in the correct format.`));
    return;
  }
  try {
    const queryResult = await connection.query(
      `SELECT COUNT(*) AS number FROM view_submission_problem WHERE ?`,
      req.body.condition
    );
    res.json(result(queryResult[0].number));
  } catch (error) {
    console.error(error);
    res.json(error(error));
  }
});

export default router;
