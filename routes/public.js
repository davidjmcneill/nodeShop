const express = require("express");
const router = express.Router();
const mysql = require('mysql');

let DB = require('../hidden/db.js');
const con = mysql.createConnection({
    host: DB.host,
    user: DB.user,
    password: DB.password
});

var auth = 0;
//authentication levels
// 0 = not authenticated (guest)
// 1 = customer
// 2 = staff
// 3 = administrator/developer

var moment = require('moment');
const today = moment().format('YYYY-MM-DD');
//var moment = require('moment-timezone');
//var node_email = require('nodemailer');
//var Chart = require('chart.js');

// Home page
router.get("/", (req, res) => {
    res.render("index.pug",{auth : auth});
});

// Order Tracking Page
router.get("/orders", (req, res) => {
    if (auth < 2) {
        res.redirect("index.pug");
    }
    res.render("orders.pug",{auth : auth});
});

router.get("/current_orders", (req, res) => {
    con.connect(function(err) {
        con.query(`SELECT * FROM shop.orders ORDER BY date_due ASC`, function(err, result, fields) {
            if (err) res.send(err);
            if (result) {
                for (var i = 0; i < result.length; i++) {
                    if (moment(result[i]['date_due']).format('YYYY-MM-DD') === today) {
                        if (moment.duration(moment().diff(result[i]['date_due'])) > 0) {
                            result[i]['date_due'] = "LATE! ("+moment.duration(moment().diff(result[i]['date_due'])).humanize()+" ago)";
                        } else {
                            result[i]['date_due'] = moment.duration(moment().diff(result[i]['date_due'])).humanize();
                        }
                    } else {
                        result[i]['date_due'] = moment(result[i]['date_due']).format('dddd, MMMM Do YYYY, h:mm:ssa');
                    }
                    result[i]['date_created'] = moment(result[i]['date_created']).format('dddd, MMMM Do YYYY, h:mm:ssa');
                }
                res.send(result);
            }
        });
    });
});


router.get("/register.pug", (req, res) => {
    res.render("register.pug",{auth : auth});
});

//Redirect for non-existent page attempts - not working
router.get("", (req, res) => {
    res.render('/invalid');
});

router.post('/users', (req, res) => {
    if (req.query.username && req.query.email && req.query.age) {
        console.log('Request received');
        con.connect(function(err) {
            con.query(`INSERT INTO shop.users (username, email, age) VALUES ('${req.query.username}', '${req.query.email}', '${req.query.age}')`, function(err, result, fields) {
                if (err) res.send(err);
                if (result) res.send({username: req.query.username, email: req.query.email, age: req.query.age});
                if (fields) console.log(fields);
            });
        });
    } else {
        console.log('Missing a parameter');
    }
});

router.get('/users', (req, res) => {
    con.connect(function(err) {
        con.query(`SELECT * FROM shop.users`, function(err, result, fields) {
            if (err) res.send(err);
            if (result) res.send(result);
        });
    });
});

module.exports = router;