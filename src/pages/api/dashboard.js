import jwt from "jsonwebtoken";

export default function handler(req, res) {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>" formatında gelir.

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ message: `Welcome ${decoded.email}!` });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
