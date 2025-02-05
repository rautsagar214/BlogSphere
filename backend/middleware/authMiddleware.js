import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config()

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  // Get token from the authorization header
  const token = req.header("Authorization");
  console.log("Received Token Header :",token)

  // If no token, respond with an error
  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  // Remove the "Bearer " prefix from the token if present
  const bearerToken = token.split(" ")[1];

  // Verify the token
  console.log(bearerToken,process.env.JWT_SECRET)
  jwt.verify(bearerToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    
    // Attach the decoded user info to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  });
};

export default authenticateToken;
