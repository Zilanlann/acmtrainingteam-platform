import util from 'util';
import config from 'config';
import { createConnection } from 'mysql';

const dbConfig = config.get('dbConfig');
const connection = createConnection(dbConfig);
console.log(`The database ${dbConfig.database} is connected.`);
connection.query = util.promisify(connection.query);

export default connection;
