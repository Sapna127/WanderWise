import jwt from "jsonwebtoken";

export function authenticate(req) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Unauthorized", status: 401 };
  }

  const token = authHeader.split(" ")[1]; // Extract token from "Bearer <TOKEN>"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { user: decoded }; // Contains { userId, email }
  } catch (error) {
    return { error: "Invalid token", status: 401 };
  }
}
