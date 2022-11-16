import express from 'express';
import connection from '../dbConnection.js';

const router = express.Router();

// $route  POST api/user/register
// @access public
router.post('/register', async (req, res) => {
	try{
		await connection.query(`INSERT INTO user SET ?`, req.body);
		res.json(`User ${req.body.name} has been registered successfully.`);
	}
	catch (err) {
		res.status(400).json(err);
	}
});

export default router;
