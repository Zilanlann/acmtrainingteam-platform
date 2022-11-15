import express from 'express';
import config from 'config';
import bodyParser from 'body-parser';
import user from './api/user.js'

const app = express();
app.use(bodyParser.json());

app.use('/api/users', user);

const port = config.get('serverPort') || 5000;
app.listen(port, () => {
  console.log(`Server is running on PORT ${port}.`);
});
