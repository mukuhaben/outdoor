const jwt = require("jsonwebtoken");

module.exports = function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

    if (decoded.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
