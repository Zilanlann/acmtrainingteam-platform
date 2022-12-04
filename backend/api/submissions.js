import express from "express";
import query from "../dbQuery.js";
import { result, error } from "./tools/apiDataFormat.js";

const router = express.Router();

const JOIN_SQL = `(s.leetcode_problem_id = p.leetcode_problem_id OR
	s.codeforces_problem_id = p.codeforces_problem_id) AND u.id = s.user_id`;

function getAddtionalSql(filter, search) {
  let addtionalSql = "";
  if (filter?.platform === "Codeforces") {
    addtionalSql += " AND s.codeforces_problem_id IS NOT NULL";
  } else if (filter?.platform === "LeetCode") {
    addtionalSql += " AND s.leetcode_problem_id IS NOT NULL";
  }
  if (filter?.status?.length) {
    addtionalSql += ` AND (status = '${filter.status.join(
      "' OR status = '"
    )}')`;
  }
  if (filter?.rating?.length === 2) {
    addtionalSql += ` AND s.rating > ${filter.rating[0]} AND s.rating < ${filter.rating[1]}`;
  }
  if (filter?.time?.length === 2) {
    const beginTimestamp = new Date(filter.time[0]).getTime() / 1000;
    const endTimestamp = new Date(filter.time[1]).getTime() / 1000 + 86400;
    addtionalSql += ` AND submit_time > ${beginTimestamp} AND submit_time < ${endTimestamp}`;
  }
  if (filter?.tags?.length) {
    addtionalSql += ` AND (tags LIKE '%${filter.tags.join(
      "%' AND tags LIKE '%"
    )}%')`;
  }

  if (search?.problem) {
    addtionalSql += ` AND title LIKE '%${search.problem}%'`;
  } else if (search?.user) {
    addtionalSql += ` AND u.name LIKE '%${search.user}%'`;
  }
  return addtionalSql ? addtionalSql : "";
}

// $route  POST api/submissions
// @access public
router.post("/", async (req, res) => {
  if (!(req.body.condition && req.body.page)) {
    res.json(error(`Data is not in the correct format.`));
    return;
  }
  const addtionalSql = getAddtionalSql(req.body?.filter, req.body?.search);
  try {
    const queryResult = await query(
      `SELECT submission_id, s.leetcode_problem_id leetcode_problem_id, 
			 s.codeforces_problem_id codeforces_problem_id, user_id, u.name user_name, 
			 submit_time, status, title, title_slug, s.rating rating, tags
			 FROM submission s, problem p, user u
			 WHERE ? ${addtionalSql} AND ${JOIN_SQL}
			 LIMIT ${15 * (req.body.page - 1)}, 15`,
      req.body.condition
    );
    res.json(result(queryResult));
  } catch (err) {
    console.error(err);
    res.json(error(err));
  }
});

export default router;
