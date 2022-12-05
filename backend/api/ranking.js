import express from "express";
import query from "../dbQuery.js";
import { result, error } from "./tools/apiDataFormat.js";

const router = express.Router();

// $route  POST api/ranking
// @access public
router.post("/", async (req, res) => {
  // 30 days
  const monthBeginTimestamp = parseInt(Date.now() / 1000) - 86400 * 30;
  // 7 days
  const weekBeginTimestamp = parseInt(Date.now() / 1000) - 86400 * 7;
  try {
    const queryResult = await query(
      `SELECT name user_name,
       COUNT(*) month_submission_number,
       COUNT(status = 'Accepted' OR NULL) month_ac_submission_number,
       AVG(IF(status = 'Accepted', rating, NULL)) month_average_ac_rating,
       COUNT(submit_time > ${weekBeginTimestamp} OR NULL) week_submission_number,
       COUNT(submit_time > ${weekBeginTimestamp}
          AND status = 'Accepted' OR NULL) week_ac_submission_number,
       AVG(IF(status = 'Accepted' AND submit_time > ${weekBeginTimestamp},
          rating, NULL)) week_average_ac_rating,
       SUM(IF(status = 'Accepted', 
			 		rating * (submit_time - ${monthBeginTimestamp}) / (800 * 86400), 0))
          active_score
			 FROM submission s, user u
			 WHERE submit_time > ${monthBeginTimestamp} AND user_id = u.id
			 GROUP BY user_id ORDER BY active_score DESC;`
    );
    res.json(result(queryResult));
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

// $route  POST api/ranking/following
// @access public
router.post("/following", async (req, res) => {
  // 30 days
  const monthBeginTimestamp = parseInt(Date.now() / 1000) - 86400 * 30;
  // 7 days
  const weekBeginTimestamp = parseInt(Date.now() / 1000) - 86400 * 7;
  try {
    const queryResult = await query(
      `SELECT name user_name,
       COUNT(*) month_submission_number,
       COUNT(status = 'Accepted' OR NULL) month_ac_submission_number,
       AVG(IF(status = 'Accepted', rating, NULL)) month_average_ac_rating,
       COUNT(submit_time > ${weekBeginTimestamp} OR NULL) week_submission_number,
       COUNT(submit_time > ${weekBeginTimestamp}
          AND status = 'Accepted' OR NULL) week_ac_submission_number,
       AVG(IF(status = 'Accepted' AND submit_time > ${weekBeginTimestamp},
          rating, NULL)) week_average_ac_rating,
       SUM(IF(status = 'Accepted', 
			 		rating * (submit_time - ${monthBeginTimestamp}) / (800 * 86400), 0))
          active_score
			 FROM submission s, user u
			 WHERE submit_time > ${monthBeginTimestamp} AND user_id = u.id
			 GROUP BY user_id ORDER BY active_score DESC;`
    );
    res.json(result(queryResult));
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

export default router;
