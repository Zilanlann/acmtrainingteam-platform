import express from "express";
import connection from "../dbConnection.js";

const router = express.Router();

// $route  POST api/submissions
// @access public
router.post("/", async (req, res) => {
  if (!req.body) {
    res.status(400).json(`Data is not in the correct format.`);
    return;
  }
  try {
    const queryResult = await connection.query(
      `SELECT s.submission_id, s.leetcode_problem_id, s.codeforces_problem_id, s.user_id, s.submit_time, s.status, p.title, p.title_slug, p.rating FROM submission AS s, problem AS p WHERE (s.leetcode_problem_id = p.leetcode_problem_id OR s.codeforces_problem_id = p.codeforces_problem_id) AND ?`,
      req.body
    );
    res.json({ ok: true, result: queryResult });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
