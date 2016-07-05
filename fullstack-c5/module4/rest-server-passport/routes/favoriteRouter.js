var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var Favorites = require('../models/favorites');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Favorites.find({ postedBy: req.decoded._doc._id })
    .populate('postedBy')
    .populate('dishes')
    .exec(
        function (err, dish) {
            if (err) throw err;
            res.json(dish);
        });
})

.post(Verify.verifyOrdinaryUser, function (req, res, next) {
    Favorites.findOne({postedBy: req.decoded._doc._id}, function (err, favorites) {
        if (err) throw err;

        if (favorites)
            (!isDuplicate(favorites, req.body._id)) ? updateFavorites(favorites) : next(new Error(`Dish:${req.body._id} already favorited!`));
        else {
            Favorites.create({postedBy: req.decoded._doc._id}, function (err, favorites) {
                if (err) throw err;
                updateFavorites(favorites);
            });
        }
    });
    
    //helper methods
    function isDuplicate(favorites, dishId) {
        if (favorites.dishes.indexOf(dishId) > -1)
            return true;
        else
            return false;
    }
    function updateFavorites(favorites) {
        favorites.dishes.push(req.body._id);
        favorites.save(function(err, favorites) {
            if (err) throw err;
            res.json(favorites);
        });
    }

})

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    Favorites.remove({ postedBy: req.decoded._doc._id },
        function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
});


favoriteRouter.route('/:dishId')
.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    Favorites.findByIdAndRemove(req.params.dishId,
        function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
})


module.exports = favoriteRouter;