'use strict';

//let model = require('../models/thingsModel.js');

exports.readAll = async function (req, res) {
    try {
        //const things = {things: await model.readAll()};
        res.render('index', {things: {}})
    } catch(err) {
        res.json({"Error": err})
    }
};

exports.upload = async function (req, res) {
    try {
        //const things = {things: await model.readAll()};
        console.log("Test: ", Date.now())
        console.log(req.files.SQLfile);        
    } catch(err) {
        res.json({"Error": err})
    }
};