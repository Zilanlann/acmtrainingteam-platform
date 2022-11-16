import connection from './connection.js';

export default class User {
  static async registerUser(userObject) {
    const query = `INSERT INTO user SET ?`;
    return connection.query(query, userObject);
  }

  static async updateUser(userId, userObject) {
    const query = `UPDATE user SET ? WHERE ID = ${userId}`;
    return connection.query(query, userObject);
  }

  static async getUserInformation(condition) {
    const query =
      `SELECT id, name, type, email, qq, about, codeforces_handle, leetcode_handle FROM user
		WHERE` + connection.escape(condition);
    return connection.query(query);
  }
}