import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persiste();
      });
  }

  select(table, search) {
    let data = this.#database[table] ?? [];
    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }
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

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id == id);

    if (rowIndex != -1) {
      const description = data.description
        ? data.description
        : this.#database[table][rowIndex].description;

      const title = data.title
        ? data.title
        : this.#database[table][rowIndex].title;

      this.#database[table][rowIndex] = {
        id,
        title,
        description,
        completed_at: this.#database[table][rowIndex].completed_at,
        created_at: this.#database[table][rowIndex].created_at,
        updated_at: new Date(),
      };

      this.#persiste();
    }
  }

  completeTask(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id == id);

    if (rowIndex != -1) {
      const completed_at = !this.#database[table][rowIndex].completed_at
        ? true
        : false;
      this.#database[table][rowIndex].completed_at = completed_at;
      this.#persiste();
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id == id);

    if (rowIndex != -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persiste();
    }
  }

  #persiste() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }
}
