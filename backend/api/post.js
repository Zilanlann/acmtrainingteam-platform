import express from "express";
import query from "../dbQuery.js";
import { result, error } from "./tools/apiDataFormat.js";
import getOrderSql from "./tools/getOrderSql.js";

const router = express.Router();

// $route  POST api/post/add
// @access private
router.post("/add", async (req, res) => {
  if (!(req.body.problem_id && req.body.auth && req.body.content)) {
    res.json(error(`Data is not in the correct format.`));
    return;
  }
  try {
    const selectResult = await query(
      `SELECT id, password FROM user WHERE id = ${req.body.auth.id}`
    );
    if (
      selectResult.length === 0 ||
      selectResult[0].password !== req.body.auth.password
    ) {
      res.json(error("Wrong authorization."));
      return;
    }
    const floor = await query(`SELECT floor_number, last_floor FROM post
		WHERE problem_id = ${req.body.problem_id}`);
    const lastFloor = floor.length === 0 ? 1 : floor[0].last_floor + 1;
    if (lastFloor === 1) {
      await query(`INSERT INTO post SET problem_id = ${req.body.problem_id},
			last_user_id = ${req.body.auth.id}`);
    } else {
      await query(
        `UPDATE post SET floor_number = floor_number + 1,
				last_floor = last_floor + 1, last_user_id = ${req.body.auth.id}
				WHERE problem_id = ${req.body.problem_id}`
      );
    }
    await query(`INSERT INTO post_floor SET user_id = ${req.body.auth.id},
		problem_id = ${req.body.problem_id}, floor_id = ${lastFloor},
		content = '${req.body.content}'`);
    res.json(result(`Post successfully.`));
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

// $route  POST api/post/delete
// @access private or admin
router.post("/delete", async (req, res) => {
  if (!(req.body.problem_id && req.body.auth && req.body.floor_id)) {
    res.json(error(`Data is not in the correct format.`));
    return;
  }
  try {
    const selectResult = await query(
      `SELECT id, password FROM user WHERE id = ${req.body.auth.id}`
    );
    if (
      selectResult.length === 0 ||
      selectResult[0].password !== req.body.auth.password
    ) {
      res.json(error("Wrong authorization."));
      return;
    }
    await query(
      `DELETE FROM post_floor WHERE problem_id = ${req.body.problem_id} 
			AND floor_id = ${req.body.floor_id}`
    );
    await query(
      `UPDATE post SET floor_number = floor_number - 1
				WHERE problem_id = ${req.body.problem_id}`
    );
    res.json(result(`Delete successfully.`));
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

function getAddtionalSql(filter, search) {
  let addtionalSql = "";
  if (filter?.platform === "Codeforces") {
    addtionalSql += " AND codeforces_problem_id IS NOT NULL";
  } else if (filter?.platform === "LeetCode") {
    addtionalSql += " AND leetcode_problem_id IS NOT NULL";
  }
  if (filter?.rating?.length === 2) {
    addtionalSql += ` AND rating >= ${filter.rating[0]} AND rating <= ${filter.rating[1]}`;
  }
  if (filter?.tags?.length) {
    addtionalSql += ` AND (tags LIKE '%${filter.tags.join(
      "%' AND tags LIKE '%"
    )}%')`;
  }

  if (search) {
    addtionalSql += ` AND title LIKE '%${search}%'`;
  }
  return addtionalSql ? addtionalSql : "";
}

// $route  POST api/post/recent
// @access public
router.post("/recent", async (req, res) => {
  if (!req.body.page) {
    res.json(error(`Data is not in the correct format.`));
    return;
  }
  const addtionalSql = getAddtionalSql(req.body?.filter, req.body?.search);
  const orderSql = getOrderSql(req.body.order);
  try {
    const queryResult = await query(
      `SELECT problem.id problem_id, leetcode_problem_id, codeforces_problem_id,
       title, title_slug, rating, tags, post.update_time time,
			 floor_number, name user_name, codeforces_avatar, leetcode_avatar
			 FROM problem, post, user u WHERE problem.id = post.problem_id AND
			 last_user_id = u.id ${addtionalSql} ${orderSql}
			 LIMIT ${15 * (req.body.page - 1)}, 15`
    );
    res.json(result(queryResult));
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

// $route  POST api/post/get
// @access public
router.post("/get", async (req, res) => {
  if (!req.body.problem_id) {
    res.json(error(`Data is not in the correct format.`));
    return;
  }
  try {
    const problem = await query(
      `SELECT * FROM problem WHERE id = ${req.body.problem_id}`
    );
    if (problem.length === 0) {
      res.json(error(`Can not find this problem.`));
      return;
    }
    const posts = await query(
      `SELECT floor_id, p.update_time time, user_id,
			content, name user_name, codeforces_avatar, leetcode_avatar
			FROM post_floor p, user u 
			WHERE problem_id = ${req.body.problem_id} AND user_id = u.id`
    );
    res.json(
      result({
        problem: problem[0],
        posts,
      })
    );
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

export default router;
