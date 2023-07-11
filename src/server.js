import http from "node:http";
import { json } from "./middleware/json.js";
import { randomUUID } from "node:crypto";
import { Database } from "./database.js";

const database = new Database();

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

  if (method == "GET" && url == "/tasks") {
    res.end(JSON.stringify(database.select("tasks")));
  }

  if (method == "POST" && url == "/tasks") {
    const { title, descrition } = req.body;

    database.insert("tasks", {
      id: randomUUID(),
      title,
      descrition,
      completed_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    res.writeHead(201).end();
  }
});

server.listen(3333);
