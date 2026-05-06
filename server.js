const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');
const Url = require('./models/Url');

const app = express();
app.use(express.json());

// connect MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/urlShortener')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// create short URL
app.post('/shorten', async (req, res) => {
  const { url } = req.body;

  const shortId = shortid.generate();

  const newUrl = new Url({
    originalUrl: url,
    shortid
  });

  await newUrl.save();

  res.json({ shortUrl: `http://localhost:3000/${shortId}` });
});

// redirect
app.get('/:shortId', async (req, res) => {
  const url = await Url.findOne({ shortId: req.params.shortId });

  if (url) {
    url.clicks++;
    await url.save();
    res.redirect(url.originalUrl);
  } else {
    res.send("URL not found");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));