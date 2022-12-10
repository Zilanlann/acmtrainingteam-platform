import express from "express";
import query from "../dbQuery.js";
import { result, error } from "./tools/apiDataFormat.js";

const router = express.Router();

// $route  POST api/ranking
// @access public
router.post("/", async (req, res) => {
  try {
    const queryResult = await query(
      `SELECT user_id, name user_name, 
			leetcode_avatar, codeforces_avatar, active_score,
			week_submission_number, week_ac_submission_number, week_average_ac_rating,
			month_submission_number, month_ac_submission_number, month_average_ac_rating
			FROM user_daily_status s, user u
			WHERE user_id = u.id`
    );
    res.json(result(queryResult));
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

export default router;
