
/* Dependencies */
var mongoose = require('mongoose'), 
    Listing = require('../models/listings.server.model.js');

/*
  In this file, you should use Mongoose queries in order to retrieve/add/remove/update listings.
  On an error you should send a 404 status code, as well as the error message. 
  On success (aka no error), you should send the listing(s) as JSON in the response.

  HINT: if you are struggling with implementing these functions, refer back to this tutorial 
  from assignment 3 https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
 */

/* Create a listing */
exports.create = function(req, res) {

  /* Instantiate a Listing */
  var listing = new Listing(req.body);

  /* save the coordinates (located in req.results if there is an address property) */
  if(req.results) {
    listing.coordinates = {
      latitude: req.results.lat, 
      longitude: req.results.lng
    };
  }

  /* Then save the listing */
  listing.save(function(err) {
    if(err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(listing);
    }
  });
};

/* Show the current listing */
exports.read = function(req, res) {
  res.json(req.listing);
};

/* Update a listing */
exports.update = function(req, res) {
  var listing = req.listing;

  // Update individual fields
  listing.code = req.body.code ;
  listing.name = req.body.name ;
  
  if (req.body.address) {
    listing.address = req.body.address ;
    listing.coordinates = {
      latitude: req.results.lat, 
      longitude: req.results.lng
    } ;
  } ;

  /* Then save the listing */
  listing.save(function(err) {
    if(err) {
      console.log(err) ;
      res.status(400).send(err) ;
    } else res.json(listing) ;
  }) ;
};

/* Delete a listing */
exports.delete = function(req, res) {
  var listing = req.listing;
  
  // Find the listing of interest
  Listing.find(listing, function(err, listings) {
		if (err) {
      console.log(err) ;
      res.status(404).send(err) ;
    } ;
		
    // Remove it from the database
		listings[0].remove(function(err) {
			if (err) {
        console.log(err) ;
        res.status(404).send(err) ;
      } else res.json(listing) ;
		}) ;
	}) ;
};

/* Retreive all the directory listings, sorted alphabetically by listing code */
exports.list = function(req, res) {
  Listing.find({}, function(err, listings) {
		if (err) {
      console.log(err) ;
      res.status(404).send(err) ;
    } else res.json(listings) ;
	}) ;
};

/* 
  Middleware: find a listing by its ID, then pass it to the next request handler. 

  HINT: Find the listing using a mongoose query, 
        bind it to the request object as the property 'listing', 
        then finally call next
 */
exports.listingByID = function(req, res, next, id) {
  Listing.findById(id).exec(function(err, listing) {
    if(err) {
      res.status(400).send(err);
    } else {
      req.listing = listing;
      next();
    }
  });
};