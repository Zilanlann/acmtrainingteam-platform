import express from "express"
import config from "config"
import { createConnection } from "mysql"

const app = express()

const dbConfig = config.get("dbConfig")
const connection = createConnection(dbConfig)
console.log(`The database ${dbConfig.database} is connected.`)

app.get("/", (req, res) => {
    res.send("Hello")

    connection.query("SELECT 1 + 1 AS solution", function(error, results, fields) {
        if (error) throw error
        console.log("The solution is: ", results[0].solution)
    })
})

const port = config.get("serverPort") || 5000

app.listen(port, () => {
    console.log(`Server is running on PORT ${port}.`)
})