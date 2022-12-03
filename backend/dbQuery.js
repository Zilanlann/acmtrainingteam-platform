import connection from "./dbConnection.js";
import mysql from "mysql";

export default async (sqlString, values) => {
  const sql = mysql.format(sqlString, values);
  console.log(sql);
  return connection.query(sql);
};
