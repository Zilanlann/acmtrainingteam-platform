import express from "express";
import query from "../dbQuery.js";
import { result, error } from "./tools/apiDataFormat.js";

const router = express.Router();

// $route  POST api/following/add
// @access public
router.post("/add", async (req, res) => {
  if (!req.body.follow_id || !req.body.user_id) {
    res.json(error(`Data is not in the correct format.`));
    return;
  }

  try {
    await query(`INSERT INTO user_following SET ?`, req.body);
    res.json(result(`Add following successfully.`));
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

// $route  POST api/following/delete
// @access public
router.post("/delete", async (req, res) => {
  if (!req.body.follow_id || !req.body.user_id) {
    res.json(error(`Data is not in the correct format.`));
    return;
  }

  try {
    await query(
      `DELETE FROM user_following
		WHERE user_id = ${req.body.user_id} AND follow_id = ${req.body.follow_id}`
    );
    res.json(result(`Delete successfully.`));
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

// $route  POST api/following/list
// @access public
router.post("/list", async (req, res) => {
  if (!req.body.user_id) {
    res.json(error(`Data is not in the correct format.`));
    return;
  }
  try {
    const selectResult = await query(
      `SELECT nickname, name, email, codeforces_handle, leetcode_handle,
			user_id, follow_id, codeforces_avatar, leetcode_avatar 
		  FROM user u, user_following f WHERE ? AND follow_id = u.id`,
      req.body
    );
    res.json(result(selectResult));
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

// $route  POST api/following/userlisttofollow
// @access public
router.post("/userlisttofollow", async (req, res) => {
  if (!req.body.user_id) {
    res.json(error(`Data is not in the correct format.`));
    return;
  }
  try {
    const selectResult = await query(
      `SELECT id, name, codeforces_handle, leetcode_handle 
			FROM user WHERE id NOT IN 
			(SELECT follow_id FROM user_following WHERE user_id = ${req.body.user_id})`
    );
    res.json(result(selectResult));
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

export default router;
