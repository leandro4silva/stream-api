import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf8")
      .then(() => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persiste();
      });
  }

  select(table, search) {
    const data = this.#database[table] ?? [];
    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }
    this.#persiste();
    return data;
  }

  #persiste() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }
}
