// libraries
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
// remove dotenv in app.js and instead import from spotify auth

// object imports
const routes = require("./routes");
const authRoutes = require('./routes.js');
const { spotifyApi } = require('./spotify_authorization.js');
//const functions = require('./spotify_functions');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors());

app.use('/api', cors(), authRoutes);
app.set("port", port);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(routes);

app.listen(app.get("port"), () =>{
  console.log("Server started on port "+app.get("port"));
});
