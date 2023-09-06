const express = require("express");
require("dotenv").config();
const { Pool } = require("pg");
const { v4: uuid } = require("uuid");
const {
  validateRequestBody,
  checkRequestBody,
  validateFields,
  authenticateUser,
} = require("./middlewares");

const app = express();

app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: true,
  port: 5432,
});

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS data (
    id UUID PRIMARY KEY,
    field_1 varchar(255),
    author varchar(255),
    description TEXT,
    my_numeric_field integer
  );
`;

pool.query(createTableQuery, (err, result) => {
  if (err) {
    console.error("Error creating table: ", err);
  } else {
    console.log("Table created succesfully");
    startServer();
  }
});

async function startServer() {
  app.post(
    "/input/:field",
    checkRequestBody,
    validateRequestBody,
    validateFields,
    authenticateUser,
    async (req, res) => {
      const { field } = req.params;
      let { field_1, author, description, my_numeric_field } = req.body;
      const id = uuid();
      switch (field) {
        case "field_1":
          field_1 = field_1.toUpperCase();
          break;
        case "author":
          author = author.toUpperCase();
          break;
        case "description":
          description = description.toUpperCase();
          break;
      }
      try {
        const client = await pool.connect();
        const query =
          "INSERT INTO data (id, field_1, author, description, my_numeric_field) VALUES ($1, $2, $3, $4, $5)";
        const values = [id, field_1, author, description, my_numeric_field];
        await client.query(query, values);
        client.release();
        return res.json({ id: id });
      } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  app.get("/data/:id", authenticateUser, async (req, res) => {
    const { id } = req.params;
    try {
      const client = await pool.connect();
      const query = "SELECT * FROM data WHERE id = $1";
      const result = await client.query(query, [id]);
      const data = result.rows[0];
      client.release();
      return res.json(data);
    } catch (error) {
      return res.status(404).json({ error: "Data not found" });
    }
  });

  const server = app.listen(5000, () => {
    console.log("Server started on port 5000");
  });

  process.on("SIGINT", () => {
    console.log("Stopping server...");
    server.close(() => {
      console.log("Server stopped.");
      pool.end();
      process.exit(0);
    });
  });
}
