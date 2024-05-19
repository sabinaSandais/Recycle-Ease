import jwt from "jsonwebtoken";
const secret = "test";
const auth = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.id = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default auth;
