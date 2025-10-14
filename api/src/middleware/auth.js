const jwt = require("jsonwebtoken");

exports.requireAuth = (req, res, next) => {
  const hdr = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Token manquant" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role }; // ✅ standard JWT
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
};
