import express from "express";
import query from "../dbQuery.js";
import { result, error } from "./tools/apiDataFormat.js";

const router = express.Router();

// $route  POST api/list/addlist
// @access public
router.post("/addlist", async (req, res) => {
  if (!req.body.user_id || !req.body.list_name) {
    res.json(error(`Data is not in the correct format.`));
    return;
  }

  try {
    await query(`INSERT INTO user_list SET ?`, req.body);
    res.json(result(`Add list successfully.`));
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

// $route  POST api/list/deletelist
// @access public
router.post("/deletelist", async (req, res) => {
  if (!req.body.list_id) {
    res.json(error(`Data is not in the correct format.`));
    return;
  }

  try {
    await query(`DELETE FROM list_user WHERE list_id = ${req.body.list_id}`);
    await query(`DELETE FROM user_list WHERE id = ${req.body.list_id}`);
    res.json(result(`Delete list successfully.`));
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

// $route  POST api/list/getlist
// @access public
router.post("/getlist", async (req, res) => {
  if (!req.body.user_id) {
    res.json(error(`Data is not in the correct format.`));
    return;
  }
  try {
    const selectResult = await query(
      `SELECT id, list_name FROM user_list
			WHERE user_id = ${req.body.user_id}`
    );
    res.json(result(selectResult));
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

// $route  POST api/list/getuser
// @access public
router.post("/getuser", async (req, res) => {
  if (!req.body.list_id) {
    res.json(error(`Data is not in the correct format.`));
    return;
  }
  try {
    const selectResult = await query(
      `SELECT user_id, name, codeforces_handle, leetcode_handle,
			codeforces_avatar, leetcode_avatar
		  FROM list_user, user u WHERE user_id = u.id
			AND list_id = ${req.body.list_id}`
    );
    res.json(result(selectResult));
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

// $route  POST api/list/usertoadd
// @access public
router.post("/usertoadd", async (req, res) => {
  if (!req.body.list_id) {
    res.json(error(`Data is not in the correct format.`));
    return;
  }
  try {
    const selectResult = await query(
      `SELECT id, name, codeforces_handle, leetcode_handle 
			FROM user WHERE id NOT IN (SELECT user_id FROM list_user
			WHERE list_id = ${req.body.list_id})`
    );
    res.json(result(selectResult));
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

// $route  POST api/list/adduser
// @access public
router.post("/adduser", async (req, res) => {
  if (!req.body.list_id || !req.body.user_id) {
    res.json(error(`Data is not in the correct format.`));
    return;
  }
  try {
    await query(`INSERT INTO list_user SET ?`, req.body);
    res.json(result(`Add user successfully.`));
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

// $route  POST api/list/deleteuser
// @access public
router.post("/deleteuser", async (req, res) => {
  if (!req.body.list_id || !req.body.user_id) {
    res.json(error(`Data is not in the correct format.`));
    return;
  }
  try {
    await query(`DELETE FROM list_user 
		WHERE list_id = ${req.body.list_id} AND user_id = ${req.body.user_id}`);
    res.json(result(`Delete user successfully.`));
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

// $route  POST api/list/manage
// @access public
router.post("/manage", async (req, res) => {
  if (!req.body.list_id || !req.body.users) {
    res.json(error(`Data is not in the correct format.`));
    return;
  }
  try {
    await query(`DELETE FROM list_user WHERE list_id = ${req.body.list_id}`);
    for (const userId of req.body.users) {
      await query(`INSERT INTO list_user SET 
      list_id = ${req.body.list_id}, user_id = ${userId}`);
    }
    res.json(result(`Change list users successfully.`));
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

export default router;
