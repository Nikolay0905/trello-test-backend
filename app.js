const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const { apiRoute, uiRoute } = require("./routes");
require("dotenv").config();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/api/api", apiRoute);
app.use("/api/ui", uiRoute);

app.listen(port);
