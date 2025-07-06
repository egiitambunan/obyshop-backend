const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const app = express();

// Load environment variables jika bukan production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

console.log("🔥 MONGO_URI:", process.env.MONGO_URI);

// === CORS SETUP ===
const allowedOrigins = [
  "https://obyshop.netlify.app",          // Website Public
  "https://adminobyshop.netlify.app",     // Dashboard Admin
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === Static Files ===
global.__basedir = __dirname;
const uploadPath = path.join(__dirname, "uploads/videos");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// === Logger sederhana (opsional) ===
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// === Routes ===
app.get("/", (req, res) => {
  res.send("🚀 ObyShop backend is running");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/content", require("./routes/content"));
app.use("/api/upload", require("./routes/upload"));

// === Connect MongoDB dan Start Server ===
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
