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
    let queryResult = null;
    if (req.body.condition?.tag) {
      queryResult = await connection.query(
        `SELECT problem_id, leetcode_problem_id, codeforces_problem_id,
       title, title_slug, rating, tags
			 FROM view_problem_problem_tag WHERE ?
			 LIMIT ${15 * (req.body.page - 1)}, 15`,
        req.body.condition ? req.body.condition : "1 = 1"
      );
    } else {
      queryResult = await connection.query(
        `SELECT id as problem_id, leetcode_problem_id, codeforces_problem_id,
       title, title_slug, rating, tags
			 FROM problem WHERE ?
			 LIMIT ${15 * (req.body.page - 1)}, 15`,
        req.body.condition ? req.body.condition : "1 = 1"
      );
    }
    res.json({ ok: true, result: queryResult });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// $route  POST api/problems/number
// @access public
router.post("/number", async (req, res) => {
  try {
    let queryResult = null;
    if (req.body.condition?.tag) {
      queryResult = await connection.query(
        `SELECT COUNT(DISTINCT problem_id) AS number FROM view_problem_problem_tag WHERE ?`,
        req.body.condition
      );
    } else {
      queryResult = await connection.query(
        `SELECT COUNT(id) AS number FROM problem WHERE ?`,
        req.body.condition ? req.body.condition : "1 = 1"
      );
    }
    res.json({ ok: true, number: queryResult[0].number });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

export default router;