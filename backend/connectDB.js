import config from "config"
import { createConnection } from "mysql"
const dbConfig = config.get("dbConfig")
var connection = createConnection(dbConfig)

connection.connect()

connection.query("SELECT 1 + 1 AS solution", function(error, results, fields) {
    if (error) throw error
    console.log("The solution is: ", results[0].solution)
})

connection.end()