import express from "express";
import connection from "../dbConnection.js";

const router = express.Router();

// $route  POST api/submissions
// @access public
router.post("/", async (req, res) => {
  if (!(req.body.condition && req.body.page !== undefined)) {
    res.status(400).json(`Data is not in the correct format.`);
    return;
  }
  try {
    const queryResult = await connection.query(
      `SELECT submission_id, leetcode_problem_id, codeforces_problem_id, user_id,
       submit_time, status, title, title_slug, rating, tags
			 FROM submission_problem WHERE ?
			 LIMIT ${15 * req.body.page}, 15`,
      req.body.condition
    );
    res.json({ ok: true, result: queryResult });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
