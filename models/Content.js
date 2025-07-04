const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema({
  heroTitle: String,
  heroSubtitle: String,
  heroTitleColor: String,
  heroSubtitleColor: String,
  heroBackgroundImage: String,

  aboutText: String,
  aboutVideos: [
    {
      title: { type: String, default: "" },
      desc: { type: String, default: "" },
      videoUrl: { type: String, default: "" },
    }
  ],

  contactInfo: {
    phone: String,
    email: String,
    address: String,
  },

  whatsapp: {
    contactButton: String,
    bubbleButton: String,
  },

  socialMedia: {
    instagram: String,
    facebook: String,
    tiktok: String,
  },

  theme: {
    primaryColor: String,
    backgroundColor: String,
  }
});

module.exports = mongoose.model("Content", ContentSchema);
