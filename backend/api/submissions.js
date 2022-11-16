import express from 'express';
import connection from '../dbConnection.js';

const router = express.Router();

// $route  POST api/submissions
// @access public
router.post('/', async (req, res) => {
  try {
    const queryResult = await connection.query(`SELECT * FROM submission WHERE ?`, req.body);
    res.json(queryResult);
  } catch (err) {
    res.status(400).json(err);
  }
});

export default router;
