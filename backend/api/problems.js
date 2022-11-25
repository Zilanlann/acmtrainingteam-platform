import express from "express";
import connection from "../dbConnection.js";

const router = express.Router();

// $route  POST api/problems
// @access public
router.post("/", async (req, res) => {
  if (!req.body.page) {
    res.status(400).json(`Data is not in the correct format.`);
    return;
  }
  try {
    const queryResult = await connection.query(
      `SELECT id, leetcode_problem_id, codeforces_problem_id,
       title, title_slug, rating, tags, submit_number, accepted_number
			 FROM problem_status WHERE ?
			 LIMIT ${15 * (req.body.page - 1)}, 15`,
      req.body.condition ? req.body.condition : "1 = 1"
    );
    res.json({ ok: true, result: queryResult });
  } catch (err) {
    res.status(500).json(err);
  }
});

// $route  POST api/problems/number
// @access public
router.post("/number", async (req, res) => {
  try {
    const queryResult = await connection.query(
      `SELECT COUNT(*) AS number FROM problem_status WHERE ?`,
      req.body.condition ? req.body.condition : "1 = 1"
    );
    res.json({ ok: true, number: queryResult[0].number });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
