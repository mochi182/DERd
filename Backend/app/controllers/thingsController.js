'use strict';

let model = require('../models/thingsModel.js');

exports.create = async function (req, res) {
    try {
        //await model.create(req.body);
        //res.redirect('/things');
    } catch (err) {
        res.json({"Error": err});
    }
};

exports.readAll = async function (req, res) {
    try {
        //const things = {things: await model.readAll()};
        res.render('things', {things: {}})
    } catch(err) {
        res.json({"Error": err})
    }
};

exports.read = async function (req, res) {
    try {
        //res.render('thing', {thing: await model.read(req.params.id)});
    } catch (err) {
        res.json({"Error": err});
    }
};

exports.update = async function (req, res) {
    try {
        //await model.update(req.params.id, req.body);
        //res.redirect('/thing/' + req.params.id);
    } catch (err) {
        res.json({"Error": err});
    }
};

exports.disable = async function (req, res) {
    try {
        //await model.disable(req.params.id);
        //res.redirect('/things');
    } catch (err) {
        res.json({"Error": err});
    }
};