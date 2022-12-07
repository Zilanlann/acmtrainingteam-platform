import express from "express";
import query from "../dbQuery.js";
import { result, error } from "./tools/apiDataFormat.js";

const router = express.Router();

// $route  POST api/user/register
// @access public
router.post("/register", async (req, res) => {
  try {
    await query(`INSERT INTO user SET ?`, req.body);
    res.json(result(`User ${req.body.name} has registered successfully.`));
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

// $route  POST api/user/signin
// @access public
router.post("/signin", async (req, res) => {
  try {
    if (!(req.body.type && req.body.password && req.body.usernameOrEmail)) {
      res.json(error(`Data is not in the correct format.`));
      return;
    }
    const selectResult = await query(
      `SELECT id, name, password FROM user WHERE ?? = ?`,
      [req.body.type, req.body.usernameOrEmail]
    );
    if (selectResult.length === 0) {
      res.json(error("This user has not registered."));
      return;
    }
    if (selectResult[0].password === req.body.password) {
      res.json(result(selectResult[0]));
    } else {
      res.json(error("The password is not correct."));
    }
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

// $route  POST api/user/info
// @access public
router.post("/info", async (req, res) => {
  if (!req.body.user_name) {
    res.json(error(`Data is not in the correct format.`));
    return;
  }
  try {
    const user = (
      await query(
        `SELECT id, name, email, qq, about, codeforces_handle, codeforces_avatar,
			leetcode_handle, leetcode_avatar FROM user WHERE name = '${req.body.user_name}'`
      )
    )[0];

    const id = user.id;

    const following = await query(
      `SELECT nickname, name, email, codeforces_handle, leetcode_handle,
			user_id, follow_id, codeforces_avatar, leetcode_avatar 
		  FROM user u, user_following f
			WHERE user_id = '${id}' AND follow_id = u.id`
    );

    const followers = await query(
      `SELECT nickname, name, email, codeforces_handle, leetcode_handle,
			user_id, follow_id, codeforces_avatar, leetcode_avatar 
		  FROM user u, user_following f
			WHERE follow_id = '${id}' AND user_id = u.id`
    );

    res.json(
      result({
        user,
        following,
        followers,
      })
    );
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

export default router;
