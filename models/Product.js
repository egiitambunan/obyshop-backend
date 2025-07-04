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

module.exports = mongoose.model("Product", productSchema);
