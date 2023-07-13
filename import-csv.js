import fs from "node:fs";
import { parse } from "csv-parse";

const csvPath = new URL("./tasks.csv", import.meta.url);
const parser = fs
  .createReadStream(csvPath, "utf8")
  .pipe(parse({ delimiter: "," }));

let count = 0;

for await (const record of parser) {
  if (count == 0) {
    count++;
    continue;
  }

  const [title, description] = record;

  fetch("http://localhost:3333/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
    }),
  })
    .then(() => {
      console.log("criado com sucesso");
    })
    .catch((error) => {
      console.log(error);
    });

  // Fake asynchronous operation
  //await new Promise((resolve) => setTimeout(resolve, 100));
  count++;
}
