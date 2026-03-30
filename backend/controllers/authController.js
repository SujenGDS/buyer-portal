import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "../db.js";

const generateToken = (user) => {
  return jwt.sign(
    { id: user.userId, email: user.email },
    process.env.SECRET_KEY,
    { expiresIn: "7d" },
  );
};

// REGISTER USER
const register = async (req, res) => {
  try {
    const { name, email, password, role = "buyer" } = req.body;

    const db = await connectToDatabase();

    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    if (existingUser.length) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role],
    );

    const user = { userId: result.insertId, name, email, role };
    const token = generateToken(user);

    res.status(201).json({ user, token });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN USER
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const db = await connectToDatabase();

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (!rows.length)
      return res.status(401).json({ message: "Invalid credentials" });

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.status(200).json({
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET CURRENT USER PROFILE
const getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const db = await connectToDatabase();

    const [rows] = await db.query(
      "SELECT userId, name, email, role  FROM users WHERE userId = ?",
      [userId],
    );
    if (!rows.length)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user: rows[0] });
  } catch (err) {
    console.error("GetProfile Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export { register, login, getProfile };
