import connection from './connection.js';

export default class Following {
  static async addUserFollowing(followingObject) {
    const query = `INSERT INTO user_following SET ?`;
    return connection.query(query, followingObject);
  }
}
