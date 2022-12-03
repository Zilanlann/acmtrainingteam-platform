import express from "express";
import query from "../dbQuery.js";
import { result, error } from "./tools/apiDataFormat.js";

const router = express.Router();

// $route  POST api/tags
// @access public
router.post("/", async (req, res) => {
  try {
    const queryResult = await query(`SELECT DISTINCT tag from problem_tag`);
    res.json(result(queryResult));
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

export default router;
