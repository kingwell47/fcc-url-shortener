const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortUrl: String,
  date: { type: String, default: Date.now },
});

module.exports = mongoose.model("Url", urlSchema);
