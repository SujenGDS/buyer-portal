import { connectToDatabase } from "../db.js";

const getProperties = async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [result] = await db.query("SELECT * FROM properties");
    res.json(result);
  } catch (err) {
    console.error("Get Properties Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export { getProperties };
