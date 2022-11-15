export default class Following {
  static initializeConnection(connection) {
    this.connection = connection;
	}
	
	static async addExistUserFollowing(followingObject) {
		const query = `INSERT INTO exist_user_following SET ?`;
    return await this.connection.query(query, followingObject);
	}

	static async addPlatformUserFollowing(followingObject) {
		const query = `INSERT INTO platform_user_following SET ?`;
    return await this.connection.query(query, followingObject);
	}
}
