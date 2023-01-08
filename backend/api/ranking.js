import express from "express";
import query from "../dbQuery.js";
import { result, error } from "./tools/apiDataFormat.js";
import getOrderSql from "./tools/getOrderSql.js";

const router = express.Router();

async function getAddtionalSql(filter, userId) {
  let addtionalSql = "";
  if (filter.length === 2) {
    return "";
  }
  if (filter.length > 0 && userId) {
    const followingList = (
      await query(`SELECT follow_id
		  FROM user_following WHERE user_id = ${userId}`)
    ).map((item) => {
      return item.follow_id;
    });
    if (filter[0] === "Following") {
      return `AND user_id IN (${followingList.join(",")})`;
    }
    if (filter[0] === "Unfollowing") {
      return `AND user_id NOT IN (${followingList.join(",")})`;
    }
  }
  console.log(addtionalSql);
  return addtionalSql;
}

// $route  POST api/ranking
// @access public
router.post("/", async (req, res) => {
  if (!req.body.page && !req.body.filter && !req.body.size) {
    res.json(error(`Data is not in the correct format.`));
    return;
  }
  const addtionalSql = await getAddtionalSql(req.body.filter, req.body.user_id);
  const orderSql = getOrderSql(req.body.order);
  const sql = `SELECT user_id, name user_name, 
			leetcode_avatar, codeforces_avatar, active_score,
			week_submission_number, week_ac_submission_number, week_average_ac_rating,
			month_submission_number, month_ac_submission_number, month_average_ac_rating
			FROM user_daily_status s, user u
			WHERE user_id = u.id ${addtionalSql} ${orderSql}
			LIMIT ${req.body.size * (req.body.page - 1)}, ${req.body.size}`;

  try {
    const queryResult = await query(sql);
    res.json(result(queryResult));
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

export default router;
