const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const app = express();

// ✅ Load environment variables (.env) hanya saat development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

console.log("🔥 MONGO_URI:", process.env.MONGO_URI);

// ✅ CORS agar Public & Admin bisa connect ke Backend
const allowedOrigins = [
  "https://obyshop.netlify.app",           // Website public
  "https://adminobyshop.netlify.app",      // Admin Dashboard
  "http://localhost:3000",                 // (Opsional) Dev Local
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS Not Allowed: " + origin));
    }
  },
  credentials: true,
}));

// ✅ Middleware body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Pastikan folder 'uploads/videos' otomatis dibuat jika belum ada
const uploadsDir = path.join(__dirname, "uploads");
const videosDir = path.join(uploadsDir, "videos");

// Buat folder uploads dan videos jika belum ada
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir);
}

// ✅ Semua file di /uploads (gambar, video) bisa diakses publik
app.use("/uploads", express.static(uploadsDir));

// ✅ Logger Sederhana (opsional)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ✅ Routes
app.get("/", (req, res) => {
  res.send("🚀 ObyShop Backend is Running");
});

app.use("/api/auth", require("./routes/auth"));         // Login Admin
app.use("/api/products", require("./routes/products")); // Produk
app.use("/api/content", require("./routes/content"));   // Konten
app.use("/api/upload", require("./routes/upload"));     // Upload Gambar/Video

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
  });
