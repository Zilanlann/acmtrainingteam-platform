import express from 'express';
import Following from '../dbQuery/following.js';

const router = express.Router();

// $route  POST api/following/add-exist-user-following
// @access public
router.post('/add-exist-user-following', async (req, res) => {
  try {
    await Following.addExistUserFollowing(req.body);
    res.json(`Add following of ${req.body.follow_id} successfully.`);
  } catch (err) {
    res.status(400).json(err);
  }
});

// $route  POST api/following/add-platform-user-following
// @access public
router.post('/add-platform-user-following', async (req, res) => {
  if (!req.body.nickname || !req.body.user_name || (!req.body.codeforces_handle && !req.body.leedcode_handle)) {
    res.status(400).json(`The data is not in the correct format.`);
    return;
	}
	try {
		
    await Following.addPlatformUserFollowing(req.body);
    res.json(`Add following of ${req.body.nickname} successfully.`);
  } catch (err) {
    res.status(400).json(err);
  }
});

export default router;
