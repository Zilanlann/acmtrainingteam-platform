import express from 'express';

const router = express.Router();

// $route  POST api/users/register
// @access public
router.post('/register', (req, res) => {
	console.log(req.body);
	res.send(`register`);
	console.log(connection);
});

export default router;
