import express from "express";
import config from "config";
import bodyParser from "body-parser";
import {
  user,
  list,
  submissions,
  problems,
  tags,
  ranking,
  log,
} from "./api/index.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api/user", user);
app.use("/api/list", list);
app.use("/api/submissions", submissions);
app.use("/api/problems", problems);
app.use("/api/tags", tags);
app.use("/api/ranking", ranking);
app.use("/api/log", log);

const port = config.get("serverPort") || 5000;

app.get("/test", function (req, res) {
  res.send("test");
  console.log("test");
});

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}.`);
});
