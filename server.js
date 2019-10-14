require("dotenv").config();

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
var bodyParser = require("body-parser");
// parse application/json
app.use(bodyParser.json());

const posts = [
  {
    username: "Nava",
    title: "Post 1"
  },
  {
    username: "Teja",
    title: "Post 2"
  }
];

app.get("/posts", authenticateToken, (req, res) => {
  console.log(req);
  res.json(posts.filter(post => post.username === req.user.name));
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { name: username };

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken: accessToken });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader;
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
app.listen(3000);
