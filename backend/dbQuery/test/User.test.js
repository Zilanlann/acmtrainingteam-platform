import User from '../User.js';
// import util from 'util';
// import config from 'config';
// import { createConnection } from 'mysql';

// const dbConfig = config.get('dbConfig');
// const connection = createConnection(dbConfig);
// console.log(`The database ${dbConfig.database} is connected.`);
// connection.query = util.promisify(connection.query);


// UserInformation.registerUser({
//   name: '无声好',
//   type: 'Student',
//   password: '123456',
//   email: 'wushenghaop@qq.com',
//   codeforces_handle: 'wushenghao',
//   leetcode_handle: 'shenghaowu',
//   qq: '940919742'
// });

User.updateUser(1, {
	password: '123456'
})

const res = await User.getAllPlatformHandle();
console.log(res);


