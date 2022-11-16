import express from 'express';
import User from '../dbQuery/User.js'

const router = express.Router();

// $route  POST api/user/register
// @access public
router.post('/register', async (req, res) => {
	try{
		await User.registerUser(req.body);
		res.json(`User ${req.body.name} has been registered successfully.`);
	}
	catch (err) {
		res.status(400).json(err);
	}
});

export default router;
