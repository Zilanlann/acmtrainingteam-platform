import express from 'express';
import config from 'config';
import { createConnection } from 'mysql';
import util from 'util';

const app = express();

const dbConfig = config.get('dbConfig');
const connection = createConnection(dbConfig);
console.log(`The database ${dbConfig.database} is connected.`);
connection.query = util.promisify(connection.query);

const port = config.get('serverPort') || 5000;

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}.`);
});
