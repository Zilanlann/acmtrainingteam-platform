import express from "express";
import config from "config";
import bodyParser from "body-parser";
import { user, following, submissions } from "./api/index.js";
import connection from "./dbConnection.js";

const app = express();
app.use(bodyParser.json());

app.use("/api/user", user);
app.use("/api/following", following);
app.use("/api/submissions", submissions);

const port = config.get("serverPort") || 5000;

app.all("*", function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "http://localhost:8080");
	next();
});

app.get("/test", async (req, res) => {
	const addResult = await connection.query(`SELECT 1 + 1 AS solution`);
  res.json(addResult[0].solution);
});

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}.`);
});
