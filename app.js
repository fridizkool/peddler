const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const routes = require("./routes");
//const queries = require("./spotify_query");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors());

const AuthRoutes = require('./routes.js');
app.use('/api', cors(), AuthRoutes);

app.set("port", PORT);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(routes);

app.listen(app.get("port"), function(){
  console.log("Server started on port "+app.get("port"));
});