// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  nama: String,
  harga: Number,
  kategori: String,
  deskripsi: String,
  produkBaru: { type: Boolean, default: false },
  produkUtama: { type: Boolean, default: false },
  imageFilename: String,
}, { timestamps: true });

// ✅ Virtual: buat properti 'gambar' yang bisa dipakai langsung di frontend
productSchema.virtual('gambar').get(function () {
  if (!this.imageFilename) return "";
  return `https://obyshop-backend-production-4831.up.railway.app/uploads/${this.imageFilename}`;
});

// Sertakan virtuals saat .toJSON()
productSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);
