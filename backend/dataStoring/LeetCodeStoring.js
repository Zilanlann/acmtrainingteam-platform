export default class LeetCodeStoring {
  static initializeConnection(connection) {
    this.connection = connection;
  }

  static async storeSubmissions(submissionArray) {
    const problemList = await this.connection.query(`SELECT problem_id FROM leetcode_problem`);
  }
}
