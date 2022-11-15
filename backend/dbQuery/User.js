import connection from "./connection.js";

export default class User {
  static async registerUser(userObject) {
    const query = `INSERT INTO user SET ?`;
    return connection.query(query, userObject);
  }

  static async updateUser(userId, userObject) {
    const query = `UPDATE user SET ? WHERE ID = ${userId}`;
    return connection.query(query, userObject);
  }

  static async getAllPlatformHandle() {
    const query = `SELECT id, codeforces_handle, leetcode_handle FROM user`;
    return connection.query(query);
  }
}
