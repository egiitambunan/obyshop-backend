// === routes/upload.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const Content = require("../models/Content");

// ✅ Buat folder uploads/ dan uploads/videos jika belum ada
const uploadsDir = path.join(__dirname, "..", "uploads");
const videosDir = path.join(uploadsDir, "videos");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir);

// ✅ Storage untuk gambar (hero / umum)
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage: imageStorage });

// ✅ Storage untuk video
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/videos"),
  filename: (req, file, cb) => {
    const rawExt = path.extname(file.originalname).toLowerCase();
    const finalExt = [".mp4", ".webm", ".ogg", ".mov", ".3gp"].includes(rawExt)
      ? rawExt
      : ".mp4"; // fallback ke .mp4 jika aneh
    const safeName = path
      .basename(file.originalname, rawExt)
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9_-]/g, ""); // bersihkan nama file
    cb(null, `about-video-${Date.now()}-${safeName}${finalExt}`);
  },
});
const videoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

// ✅ Upload Gambar Umum
router.post("/", upload.single("gambar"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Gagal upload" });
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// ✅ Upload Gambar Hero
router.post("/hero", upload.single("gambar"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Gagal upload" });
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// ✅ Upload Video Tentang Kami (video1, video2, video3)
router.post("/video", videoUpload.single("video"), async (req, res) => {
  try {
    const { slot } = req.body;
    if (!["video1", "video2", "video3"].includes(slot)) {
      return res.status(400).json({ error: "Slot tidak valid" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Video tidak ditemukan" });
    }

    const index = parseInt(slot.replace("video", "")) - 1;
    const videoPath = `/uploads/videos/${req.file.filename}`;

    let content = await Content.findOne();
    if (!content) content = new Content();
    if (!Array.isArray(content.aboutVideos)) {
      content.aboutVideos = [{}, {}, {}];
    }

    content.aboutVideos[index] = {
      ...content.aboutVideos[index],
      videoUrl: videoPath,
    };

    await content.save();
    res.json({ message: "Berhasil upload", videoUrl: videoPath });
  } catch (err) {
    console.error("❌ Gagal upload:", err);
    res.status(500).json({ error: "Gagal upload video" });
  }
});

module.exports = router;
