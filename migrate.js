const fs = require("fs");
const db = require("./db");

const files = fs.readdirSync("./migrations");

async function runMigrations() {
  for (const file of files) {
    await db.query(fs.readFileSync(`./migrations/${file}`, "utf-8"));
  }
  db.end();
}

runMigrations();
