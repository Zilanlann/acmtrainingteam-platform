import express from "express";
const app = express();

app.get("/", (req, res) => {
    res.send("Hello");
})

// process.env.PORT is not set now
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
})