import { buildRoutePath } from "./utils/build-route-path.js";
import { Database } from "./database.js";
import { randomUUID } from "node:crypto";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handle: (req, res) => {
      const { search } = req.query;
      const tasks = database.select(
        "tasks",
        search ? { title: search, description: search } : null
      );
      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handle: (req, res) => {
      const { title, description } = req.body;

      database.insert("tasks", {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return res.writeHead(201).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handle: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      database.update("tasks", id, {
        title: title ?? null,
        description: description ?? null,
      });

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handle: (req, res) => {
      const { id } = req.params;
      database.delete("tasks", id);
      res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handle: (req, res) => {
      const { id } = req.params;
      database.completeTask("tasks", id);
      res.writeHead(204).end();
    },
  },
];
