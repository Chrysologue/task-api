export default function checkRole(role) {
  return function (req, res, next) {
    if (req.user && req.user.role === role) {
      next();
    }
    return res.status(403).json({ error: "Access denied" });
  };
}
