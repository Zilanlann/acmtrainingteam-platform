export default class User {
  static initializeConnection(connection) {
    this.connection = connection;
  }

  static async registerUser(userObject) {
    const query = `INSERT INTO user SET ?`;
    return await this.connection.query(query, userObject);
  }

  static async updateUser(userId, userObject) {
    const query = `UPDATE user SET ? WHERE ID = ${userId}`;
    return await this.connection.query(query, userObject);
  }

  static async getAllPlatformHandle() {
    const query = `SELECT id, codeforces_handle, leetcode_handle FROM user`;
    return await this.connection.query(query);
  }
}
