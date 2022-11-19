import express from "express";
import config from "config";
import bodyParser from "body-parser";
import { user, following, submissions } from "./api/index.js";
import connection from "./dbConnection.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api/user", user);
app.use("/api/following", following);
app.use("/api/submissions", submissions);

const port = config.get("serverPort") || 5000;

app.get("/api/test", async (req, res) => {
  const addResult = await connection.query(`SELECT 1 + 1 AS solution`);
  res.json(addResult[0].solution);
});

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}.`);
});
