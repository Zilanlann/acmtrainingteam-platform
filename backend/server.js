import express from 'express';
import config from 'config';
import { createConnection } from 'mysql';
import util from 'util';
import bodyParser from 'body-parser';
import user from './api/user.js'

const dbConfig = config.get('dbConfig');
const connection = createConnection(dbConfig);
console.log(`The database ${dbConfig.database} is connected.`);
connection.query = util.promisify(connection.query);

const app = express();
app.use(bodyParser.json());

app.use('/api/users', user);

const port = config.get('serverPort') || 5000;
app.listen(port, () => {
  console.log(`Server is running on PORT ${port}.`);
});
