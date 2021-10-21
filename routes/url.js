const express = require("express");
const router = express.Router();
const validUrl = require("valid-url");
const shortid = require("shortid");

const Url = require("../models/Url");

router.use(express.urlencoded({ extended: true }));

//Adapted from Brad Traversy's URL shortening tutorial https://www.youtube.com/watch?v=Z57566JBaZQ

router.post("/", async (req, res) => {
  const urlToShorten = req.body.url;
  //check if valid url
  if (!validUrl.isUri(urlToShorten)) return res.json({ error: "invalid url" });

  //create URL code
  const urlCode = shortid.generate();

  //check if original URL already in database
  try {
    let url = await Url.findOne({ originalUrl: urlToShorten });

    if (url) {
      return res.json({
        original_url: url.originalUrl,
        short_url: url.shortUrl,
      });
    } else {
      url = new Url({
        originalUrl: urlToShorten,
        shortUrl: urlCode,
        date: new Date(),
      });

      await url.save();

      res.json({
        original_url: urlToShorten,
        short_url: urlCode,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.json("Server Error");
  }
});

router.get("/:code", async (req, res) => {
  try {
    const url = await Url.findOne({ shortUrl: req.params.code });

    if (url) {
      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json("No url found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});

module.exports = router;
