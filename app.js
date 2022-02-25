const fs = require("fs");
const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const db = require("./db");
const { APIError } = require("./utils/errors");
require("express-async-errors");

app = express();
app.use(cors());
app.use(express.json());

express.Router.validate = (joi) => (req, res, next) => {
  const validation = joi.validate(req.body);
  if (!validation.error) return next();
  res.status(400).json({ errors: validation.error.details });
};

const controllers = fs.readdirSync("./controllers");

for (const controller of controllers) {
  const router = express.Router();
  app.use(
    `/${controller.split(".")[0]}`,
    require(`./controllers/${controller}`)(router, db, Joi)
  );
}

app.use((err, req, res, next) => {
  if (err instanceof APIError) {
    return res.status(err.code).json({ errors: [{ message: err.message }] });
  }
  console.log(err);
  res.status(500).end();
  next;
});

module.exports = app;
