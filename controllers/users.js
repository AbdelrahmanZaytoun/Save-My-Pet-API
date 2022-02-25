const sql = require("sql-template-strings");

const PasswordHash = require("../utils/encrypt");
const { AuthError } = require("../utils/errors");
const { generateAccessToken, authenticateToken } = require("../utils/jwt");

module.exports = (router, db, Joi) => {
  router.post(
    "/register",
    router.validate(
      Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required(),
        phone: Joi.string().required(),
        password: Joi.string().required(),
      }).required()
    ),
    async (req, res) => {
      const { firstName, lastName, email, phone, password } = req.body;
      const hash = await PasswordHash.hash(password);
      const {
        rows: [user],
      } = await db.query(
        sql`INSERT INTO users ("firstName", "lastName", email, phone, "password") VALUES (${firstName}, ${lastName}, ${email}, ${phone}, ${hash}) RETURNING id;`
      );
      res.json({ token: generateAccessToken(user.id) });
    }
  );
  router.post(
    "/login",
    router.validate(
      Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      }).required()
    ),
    async (req, res) => {
      const { email, password } = req.body;
      const {
        rows: [user],
      } = await db.query(sql`SELECT * FROM users WHERE email = ${email}`);
      if (!user) throw new AuthError();
      if (!(await new PasswordHash(user.password).compare(password))) {
        throw new AuthError();
      }
      res.json({ token: generateAccessToken(user.id) });
    }
  );
  router.get("/", authenticateToken, async (req, res) => {
    const {
      rows: [user],
    } = await db.query(
      sql`SELECT "id", "firstName", "lastName", "email", "phone", "createdAt" FROM users WHERE id = ${req.userId}`
    );
    res.json(user);
  });

  return router;
};
