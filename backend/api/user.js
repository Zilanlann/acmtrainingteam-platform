import express, { query } from "express";
import connection from "../dbConnection.js";

const router = express.Router();

// $route  POST api/user/register
// @access public
router.post("/register", async (req, res) => {
  try {
    await connection.query(`INSERT INTO user SET ?`, req.body);
    res.send({ ok: true });
  } catch (err) {
    res.send({ ok: false, err });
  }
});

// $route  POST api/user/signin
// @access public
router.post("/signin", async (req, res) => {
  try {
    if (!(req.body.type && req.body.password && req.body.usernameOrEmail)) {
      res.status(400).json(`Data is not in the correct format.`);
      return;
    }
    const selectResult = await connection.query(
      `SELECT id, name, password FROM user WHERE ?? = ?`,
      [req.body.type, req.body.usernameOrEmail]
    );
    if (selectResult.length === 0) {
      res.send({ ok: false, message: "This user has not registered." });
      return;
    }
    if (selectResult[0].password === req.body.password) {
      res.send({ ok: true, token: selectResult[0] });
    } else {
      res.send({ ok: false, message: "The password is not correct." });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
