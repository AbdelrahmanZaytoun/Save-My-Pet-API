const sql = require("sql-template-strings");

const { NotFoundError } = require("../utils/errors");
const { authenticateToken } = require("../utils/jwt");

module.exports = (router, db, Joi) => {
  router.post(
    "/",
    authenticateToken,
    router.validate(
      Joi.object({
        name: Joi.string().required(),
        type: Joi.string().valid().required(),
        license: Joi.string().required(),
      }).required()
    ),
    async (req, res) => {
      const { name, type, license } = req.body;
      await db.query(
        sql`INSERT INTO pets ("name", "type", "license", "userId") VALUES (${name}, ${type}, ${license}, ${req.userId})`
      );
      res.status(201).end();
    }
  );
  router.get("/", authenticateToken, async (req, res) => {
    const { rows: pets } = await db.query(
      sql`SELECT * FROM pets WHERE "userId" = ${req.userId};`
    );
    res.json(pets);
  });
  router.get("/:id", async (req, res) => {
    const {
      rows: [pet],
    } = await db.query(
      sql`SELECT p.id, p.name, p.type, p.license, u."firstName" || ' ' || u."lastName" "ownerName", u.phone "ownerPhone"
      FROM pets p
      JOIN users u ON u.id = p."userId"
      WHERE p.id = ${req.params.id};`
    );
    if (!pet) throw new NotFoundError();
    res.end(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Save my pet</title>
    </head>
    <body>
        <div className="view">
            <table>
              <tr>
                <th>ID</th>
                <td>${pet.id}</td>
              </tr>
              <tr>
                <th>Name</th>
                <td>${pet.name}</td>
              </tr>
              <tr>
                <th>Type</th>
                <td>${pet.type}</td>
              </tr>
              <tr>
                <th>License</th>
                <td>${pet.license}</td>
              </tr>
              <tr>
                <th>Owner Name</th>
                <td>${pet.ownerName}</td>
              </tr>
              <tr>
                <th>Owner Phone</th>
                <td>${pet.ownerPhone}</td>
              </tr>
            </table>
    </body>
    </html>`);
  });

  return router;
};
