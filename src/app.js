"use strict";
exports.__esModule = true;
var express_1 = require("express");
var cors_1 = require("cors");
var index_1 = require("./routers/index");
var dotenv_1 = require("dotenv");
dotenv_1["default"].config();
var app = (0, express_1["default"])();
app.use((0, express_1.json)());
app.use((0, cors_1["default"])());
app.use(index_1["default"]);
var port = process.env.PORT || 4000;
app.listen(port, function () {
    console.log("App running on port ".concat(port));
});
