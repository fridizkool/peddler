// libraries
const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./routes");

// object imports
const authRoutes = require('./routes.js');
const { spotifyApi, secrets } = require('./spotify_authorization.js');
const app = express();

// configure app
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors());
app.use(routes);
app.use('/api', cors(), authRoutes);

// set values
app.set("port", secrets.port);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// launch
app.listen(app.get("port"), () => {
  console.log("Server started on port " + app.get("port"));
});
