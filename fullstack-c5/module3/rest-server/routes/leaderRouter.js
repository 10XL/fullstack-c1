var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Leaderships = require('../models/leadership');

var leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get(function (req, res, next) {
    Leaderships.find({}, function (err, leader) {
        if (err) throw err;
        res.json(leader);
    });
})

.post(function (req, res, next) {
    Leaderships.create(req.body, function (err, leader) {
        if (err) throw err;
        console.log('Leadership created!');
        var id = leader._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the leadership with id: ' + id);
    });
})

.delete(function (req, res, next) {
    Leaderships.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

leaderRouter.route('/:leaderId')
.get(function (req, res, next) {
    Leaderships.findById(req.params.leaderId, function (err, leader) {
        if (err) throw err;
        res.json(leader);
    });
})

.put(function (req, res, next) {
    Leaderships.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, {
        new: true
    }, function (err, leader) {
        if (err) throw err;
        res.json(leader);
    });
})

.delete(function (req, res, next) {
    Leaderships.findByIdAndRemove(req.params.leaderId, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});


module.exports = leaderRouter;