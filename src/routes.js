import { buildRoutePath } from "./utils/build-route-path.js";
import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";

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

      if (!title) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: "Informe o titulo da task",
          })
        );
      }

      if (!description) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: "Informe a descrição da task",
          })
        );
      }

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

      if (!title) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: "Informe o titulo da task",
          })
        );
      }

      if (!description) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: "Informe a descrição da task",
          })
        );
      }

      const updated = database.update("tasks", id, {
        title: title ?? null,
        description: description ?? null,
      });

      if (!updated) {
        return res.writeHead(404).end(
          JSON.stringify({
            message: "O id dessa task não existe",
          })
        );
      }

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handle: (req, res) => {
      const { id } = req.params;
      const deleted = database.delete("tasks", id);

      if (!deleted) {
        res.writeHead(404).end(
          JSON.stringify({
            message: "O id dessa task não existe",
          })
        );
      }

      res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handle: (req, res) => {
      const { id } = req.params;
      const completed = database.completeTask("tasks", id);

      if (!completed) {
        return res.writeHead(404).end(
          JSON.stringify({
            message: "O id dessa task não existe",
          })
        );
      }

      res.writeHead(204).end();
    },
  },
];
