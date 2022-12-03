import express from "express";
import config from "config";
import bodyParser from "body-parser";
import { user, following, submissions, problems, tags } from "./api/index.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api/user", user);
app.use("/api/following", following);
app.use("/api/submissions", submissions);
app.use("/api/problems", problems);
app.use("/api/tags", tags);

const port = config.get("serverPort") || 5000;

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}.`);
});
