import express from "express";
import connection from "../dbConnection.js";

const router = express.Router();

// $route  POST api/user/register
// @access public
router.post("/register", async (req, res) => {
  try {
    await connection.query(`INSERT INTO user SET ?`, req.body);
    res.send({
      ok: true,
      result: `User ${req.body.name} has registered successfully.`,
    });
  } catch (error) {
    console.error(error);
    res.json({ ok: false, error });
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
      res.send({ ok: false, error: "This user has not registered." });
      return;
    }
    if (selectResult[0].password === req.body.password) {
      res.send({ ok: true, result: selectResult[0] });
    } else {
      res.send({ ok: false, error: "The password is not correct." });
    }
  } catch (error) {
    console.error(error);
    res.json({ ok: false, error });
  }
});

export default router;
