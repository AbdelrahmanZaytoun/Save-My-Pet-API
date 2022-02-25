const jwt = require("jsonwebtoken");

function generateAccessToken(id) {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: "30d" });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, data) => {
    if (err) return res.sendStatus(403);

    req.userId = data.id;

    next();
  });
}

module.exports = { generateAccessToken, authenticateToken };
