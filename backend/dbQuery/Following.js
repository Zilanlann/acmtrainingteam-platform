import connection from './connection.js';

export default class Following {
  static async addExistUserFollowing(followingObject) {
    const query = `INSERT INTO exist_user_following SET ?`;
    return connection.query(query, followingObject);
  }

  static async addPlatformUserFollowing(followingObject) {
    const query = `INSERT INTO platform_user_following SET ?`;
    return connection.query(query, followingObject);
  }
}
