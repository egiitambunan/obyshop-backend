require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Product = require("./models/Product");
const User = require("./models/User");

async function seed() {
  try {
    // Pastikan koneksi berhasil sebelum lanjut
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Terhubung ke MongoDB");

    // Kosongkan data sebelumnya
    await Product.deleteMany();
    await User.deleteMany();

    // Buat admin baru
    const admin = new User({
      email: "admin@obishop.com",
      password: await bcrypt.hash("rumcellobieshopp75", 10), // tanpa spasi di "admin12345"
    });
    await admin.save();

    // Tambahkan data produk
    await Product.insertMany([
      {
        nama: "Gelang Pandora",
        harga: 15000,
        kategori: "Gelang",
        gambar: "/uploads/gelang-pandora.jpg", // harus diawali dengan "/uploads/"
        deskripsi: "Gelang elegan untuk penampilan modern.",
      },
      {
        nama: "Charger",
        harga: 35000,
        kategori: "Charger",
        gambar: "/uploads/charger.jpg",
        deskripsi: "Charger cepat dan aman.",
      },
    ]);

    console.log("✅ Data dummy berhasil disisipkan.");
    process.exit();
  } catch (err) {
    console.error("❌ Gagal seed:", err.message);
    process.exit(1);
  }
}

seed();
