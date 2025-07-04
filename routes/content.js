const express = require("express");
const multer = require("multer");
const path = require("path");
const Content = require("../models/Content");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// === Upload Video Setup ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/videos/"), // ⬅️ pastikan folder ini ada
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// === GET /api/content ===
router.get("/", async (req, res) => {
  try {
    const content = await Content.findOne();

    if (!content) return res.json({});

    // ✅ Langsung kirim aboutVideos
    res.json({
      heroTitle: content.heroTitle,
      heroSubtitle: content.heroSubtitle,
      heroTitleColor: content.heroTitleColor,
      heroSubtitleColor: content.heroSubtitleColor,
      heroBackgroundImage: content.heroBackgroundImage,

      aboutText: content.aboutText || "",
      aboutVideos: content.aboutVideos || [],

      contactInfo: content.contactInfo || {},
      whatsapp: content.whatsapp || {},
      socialMedia: content.socialMedia || {},
      theme: content.theme || {},
    });
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil konten" });
  }
});

// === PUT /api/content ===
router.put("/", auth, async (req, res) => {
  try {
    let content = await Content.findOne();
    if (!content) content = new Content();

    const {
      heroTitle,
      heroSubtitle,
      heroTitleColor,
      heroSubtitleColor,
      heroBackgroundImage,
      aboutText,
      aboutVideo1,
      aboutVideo2,
      aboutVideo3,
      aboutVideo1Desc,
      aboutVideo2Desc,
      aboutVideo3Desc,
      contactInfo,
      whatsapp,
      socialMedia,
      theme,
    } = req.body;

    // ✅ Simpan ke MongoDB
    content.heroTitle = heroTitle;
    content.heroSubtitle = heroSubtitle;
    content.heroTitleColor = heroTitleColor;
    content.heroSubtitleColor = heroSubtitleColor;
    content.heroBackgroundImage = heroBackgroundImage;
    content.aboutText = aboutText;

    // ✅ Pastikan isi array aboutVideos
    content.aboutVideos = [
      {
        title: "Video Toko Kami",
        desc: aboutVideo1Desc || "",
        videoUrl: aboutVideo1 || "",
      },
      {
        title: "Produk Unggulan",
        desc: aboutVideo2Desc || "",
        videoUrl: aboutVideo2 || "",
      },
      {
        title: "Review Pelanggan",
        desc: aboutVideo3Desc || "",
        videoUrl: aboutVideo3 || "",
      },
    ];

    content.contactInfo = contactInfo || {};
    content.whatsapp = whatsapp || {};
    content.socialMedia = socialMedia || {};
    content.theme = theme || {};

    await content.save();
    res.json({ message: "Konten berhasil diperbarui" });
  } catch (err) {
    console.error("❌ Gagal update konten:", err);
    res.status(500).json({ error: "Gagal menyimpan konten" });
  }
});

module.exports = router;
