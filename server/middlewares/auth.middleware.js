import jwt from "jsonwebtoken";

/**
 * protect middleware
 * - Verifies JWT token from cookies.
 * - For local development you can set BYPASS_AUTH=true in .env to bypass auth (ONLY for dev).
 */
export const protect = (req, res, next) => {
  try {
    // Local bypass (development only) - safe-guard: check BYPASS_AUTH flag
    if (process.env.BYPASS_AUTH === "true") {
      console.warn("Auth bypass enabled (BYPASS_AUTH). Do NOT use in production.");
      // Attach a dummy user for downstream handlers (hospital/admin id 1)
      req.user = { id: "dev-user", role: "admin", email: "dev@local" };
      return next();
    }

    const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Error:", err);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};


export const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
    return next();
  } catch (err) {
    console.error("isAdmin middleware error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
