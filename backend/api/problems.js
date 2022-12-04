import express from "express";
import query from "../dbQuery.js";
import { result, error } from "./tools/apiDataFormat.js";

const router = express.Router();

function getAddtionalSql(filter, search) {
  let addtionalSql = "";
  if (filter?.platform === "Codeforces") {
    addtionalSql += " AND codeforces_problem_id IS NOT NULL";
  } else if (filter?.platform === "LeetCode") {
    addtionalSql += " AND leetcode_problem_id IS NOT NULL";
  }
  if (filter?.rating?.length === 2) {
    addtionalSql += ` AND rating > ${filter.rating[0]} AND rating < ${filter.rating[1]}`;
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

// $route  POST api/problems
// @access public
router.post("/", async (req, res) => {
  if (!req.body.page) {
    res.json(error(`Data is not in the correct format.`));
    return;
  }
  const addtionalSql = getAddtionalSql(req.body?.filter, req.body?.search);
  try {
    const queryResult = await query(
      `SELECT id as problem_id, leetcode_problem_id, codeforces_problem_id,
       title, title_slug, rating, tags
			 FROM problem WHERE 1 = 1 ${addtionalSql}
			 LIMIT ${15 * (req.body.page - 1)}, 15`
    );
    res.json(result(queryResult));
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

export default router;
