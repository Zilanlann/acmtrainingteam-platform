import express from "express";
import query from "../dbQuery.js";
import { result, error } from "./tools/apiDataFormat.js";

const router = express.Router();

// $route  POST api/log
// @access public
router.post("/", async (req, res) => {
  if (!(req.body.size && req.body.page)) {
    res.json(error(`Data is not in the correct format.`));
    return;
  }
  try {
    const queryResult = await query(`SELECT 
		create_time, error, platform, handle, action FROM error_log
		ORDER BY id DESC LIMIT ${req.body.size * (req.body.page - 1)}, ${
      req.body.size
    }`);
    res.json(result(queryResult));
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

export default router;
