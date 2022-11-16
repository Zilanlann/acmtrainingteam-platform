import express from 'express';
import { Following, User } from '../dbQuery/index.js';

const router = express.Router();

// $route  POST api/following/add-user-following
// @access public
router.post('/add-user-following', async (req, res) => {
  if (!req.body.follow_name || !req.body.user_id) {
    res.status(400).json(`The data is not correct.`);
    return;
  }
  try {
    const selectResult = await User.getUserInformation({ name: req.body.follow_name });
    if (selectResult.length === 0) {
      res.status(400).json(`The user ${req.body.follow_name} has not registered.`);
      return;
		}
		const follow_id = selectResult[0].id;
    await Following.addUserFollowing({
      user_id: req.body.user_id,
      follow_id,
      nickname: req.body.nickname
    });
    res.json(`Add following of ${req.body.follow_name} successfully.`);
  } catch (err) {
    res.status(400).json(err);
  }
});

export default router;
