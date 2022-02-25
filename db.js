const { Client } = require("pg");

const client = new Client({ connectionString: process.env.DB_URI });
client.connect();

module.exports = client;
