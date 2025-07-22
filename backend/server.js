import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
const PORT = 5050;
const JWT_SECRET = "12345";

const USERS = [
  { username: "Rishika", password: "Rishi23" },
  { username: "admin", password: "admin123" },
  { username: "Aditya", password: "0803" }
];

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const token = jwt.sign({ username: user.username }, JWT_SECRET, {
    expiresIn: "1h",
  });
  return res.json({ message: "Login successful!", token });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
