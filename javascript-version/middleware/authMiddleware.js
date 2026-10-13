import jtw from "jsonwebtoken";

export default function checkUser(req, res, next) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(401).json({ error: "Missing authorization" });
    }
    if (!authorization.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Invalid token format. Must be Bearer <token>" });
    }
    const token = authorization.split(" ")[1];
    const decoded = jtw.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
