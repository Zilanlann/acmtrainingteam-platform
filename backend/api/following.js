import express from "express";
import connection from "../dbConnection.js";

const router = express.Router();

// $route  POST api/following/add-following
// @access public
router.post("/add-following", async (req, res) => {
  if (!req.body.follow_name || !req.body.user_id) {
    res.status(400).json(`The data is not correct.`);
    return;
  }

  try {
    const selectResult = await connection.query(`SELECT id FROM user WHERE ?`, {
      name: req.body.follow_name,
    });
    if (selectResult.length === 0) {
      res.status(400).json(`The user ${req.body.follow_name} has not registered.`);
      return;
    }

    const follow_id = selectResult[0].id;
    await connection.query(`INSERT INTO user_following SET ?`, {
      user_id: req.body.user_id,
      follow_id,
      nickname: req.body.nickname,
    });
    res.json(`Add following of ${req.body.follow_name} successfully.`);
	} catch (err) {
		console.error(err);
    res.status(400).json(err);
  }
});

export default router;
