// libraries
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// object imports
const routes = require("./routes");
const AuthRoutes = require('./routes.js');
const functions = require('./spotify_functions.js');
const { spotifyApi } = require('./spotify_authorization.js');
//const queries = require("./spotify_query");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors());

app.use('/api', cors(), AuthRoutes);
app.set("port", PORT);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(routes);

app.listen(app.get("port"), function(){
  console.log("Server started on port "+app.get("port"));
  functions.findArtist(spotifyApi, 'Petty');
});
