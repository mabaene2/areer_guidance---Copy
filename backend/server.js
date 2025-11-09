// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";
import fs from "fs";

// Load environment variables
dotenv.config();

// Load Firebase service account
const serviceAccount = JSON.parse(
  fs.readFileSync("./backend/serviceAccountKey.json", "utf8")
);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Default route
app.get("/", (req, res) => {
  res.send("🔥 Firebase Firestore Backend is running!");
});

// ✅ Add a new user
app.post("/users", async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const docRef = await db.collection("users").add({
      name,
      email,
      role,
      createdAt: new Date(),
    });
    res.status(200).send({ id: docRef.id, message: "User added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to add user" });
  }
});

// ✅ Get all users
app.get("/users", async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch users" });
  }
});

// ✅ Get user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const doc = await db.collection("users").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).send({ error: "User not found" });
    res.status(200).send({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch user" });
  }
});

// ✅ Update user
app.put("/users/:id", async (req, res) => {
  try {
    await db.collection("users").doc(req.params.id).update(req.body);
    res.status(200).send({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).send({ error: "Failed to update user" });
  }
});

// ✅ Delete user
app.delete("/users/:id", async (req, res) => {
  try {
    await db.collection("users").doc(req.params.id).delete();
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: "Failed to delete user" });
  }
});

// ✅ Run server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
