const express = require("express");
const router = express.Router();
//var moment = require('moment');
//var moment = require('moment-timezone');
//var node_email = require('nodemailer');
//var Chart = require('chart.js');

// Home page
router.get("/", (req, res) => {
    res.render("index.pug");
});
//Redirect for non-existent page attempts - not working
router.get("", (req, res) => {
    res.render('/invalid');
});

module.exports = router;