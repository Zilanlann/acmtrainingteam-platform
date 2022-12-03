import express from "express";
import connection from "../dbConnection.js";
import { result, error } from "./tools/apiDataFormat.js";

const router = express.Router();

// $route  POST api/user/register
// @access public
router.post("/register", async (req, res) => {
  try {
    await connection.query(`INSERT INTO user SET ?`, req.body);
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
    const selectResult = await connection.query(
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

export default router;
