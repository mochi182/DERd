'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/thingsController.js');

// Create
router.post('/', (req, res) => {
    controller.create(req, res);
});

// Read all
router.get('/', (req, res) => {
    controller.readAll(req, res);
});

// Read
router.get('/:id', (req, res) => {
    controller.read(req, res);
});

// Update
router.put('/:id', (req, res) => {
    controller.update(req, res);
});

// Disable
router.delete('/:id', (req, res) => {
    controller.disable(req, res);
});

module.exports = router