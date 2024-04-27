import express from "express";
import Url from "../models/Url";
import nanoid from "nanoid";

const router = express.Router();

exports.shorten = async (req, res) => {
  const { longUrl, userId } = req.body;
  const shortUrl = nanoid(8);
  try {
    const newUrl = new Url({ longUrl, shortUrl, user: userId });
    await newUrl.save();
    res.json(newUrl);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.redirect = async (req, res) => {
  const url = await Url.findOne({ shortUrl: req.params.shortUrl });
  if (url) {
    return res.redirect(url.longUrl);
  } else {
    return res.status(404).send("URL not found");
  }
};
exports.userUrls = async (req, res) => {
  try {
    const urls = await Url.find({ user: req.user.id });
    res.json(urls);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};
module.exports = router;
