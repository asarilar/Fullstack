var express = require('express');
var router = express.Router();
var models = require('../models/');

/* GET home page. */
router.get('/', function(req, res){
  models.Page.find(function(err, docs){
    res.render('index', { docs: docs, title: 'Express' });
  });
});

router.get('/add', function(req, res){
  res.render('add', { });
});

router.post('/submit', function(req, res) {
  var title = req.body.title;
  var body = req.body.body;

  var generateUrlName = function(name) {
    if (typeof name != "undefined" && name !== "") {
      // Removes all non-alphanumeric characters from name
      // And make spaces underscore
      return name.replace(/[\s]/ig,"_").replace(/[^\w]/ig,"");
    } else {
      // Generates random 5 letter string
      return Math.random().toString(36).substring(2,7);
    }
  };

  var url_name = generateUrlName(title);

  var p = new models.Page({
    "title": title,
    "body": body,
    "url_name": url_name});

  p.save();
  res.redirect('/');
});

router.get('/wiki/:url_name', function(req, res) {
  var url_name = req.params.url_name;
  models.Page.find({url_name: url_name}, function(err, docs){
    var doc = docs[0];
    res.render('show', { doc: doc });
  });
});

router.post('/wiki/:url_name/delete', function(req, res){
  var url_name = req.params.url_name;
  models.Page.findOneAndRemove({url_name:url_name}, function(err, docs){
    res.redirect('/');
  });
});

module.exports = router;