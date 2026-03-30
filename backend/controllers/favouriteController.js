import { connectToDatabase } from "../db.js";

// GET FAVOURITES
const getFavourites = async (req, res) => {
  try {
    const userId = req.userId;
    const db = await connectToDatabase();

    const [result] = await db.query(
      `SELECT p.* 
       FROM favourites f 
       JOIN properties p ON f.propertyId = p.propertyId 
       WHERE f.userId = ?`,
      [userId],
    );

    res.json(result);
  } catch (err) {
    console.error("Get Favourites Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ADD FAVOURITE
const addFavourite = async (req, res) => {
  try {
    const userId = req.userId;
    const { propertyId } = req.body;
    const db = await connectToDatabase();

    await db.query(
      "INSERT INTO favourites (userId, propertyId) VALUES (?, ?)",
      [userId, propertyId],
    );

    res.json({ message: "Added to favourites" });
  } catch (err) {
    console.error("Add Favourite Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// REMOVE FAVOURITE
const removeFavourite = async (req, res) => {
  try {
    const userId = req.userId;
    const { propertyId } = req.body;
    const db = await connectToDatabase();

    await db.query(
      "DELETE FROM favourites WHERE userId = ? AND propertyId = ?",
      [userId, propertyId],
    );

    res.json({ message: "Removed from favourites" });
  } catch (err) {
    console.error("Remove Favourite Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export { getFavourites, addFavourite, removeFavourite };
