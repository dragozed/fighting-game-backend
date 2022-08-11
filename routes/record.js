const express = require("express");
const { ObjectId } = require("mongodb");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /users.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// Get list of all the documents under deneme/users.
recordRoutes.route("/users").get(async function (req, res) {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection("users")
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
      } else {
        res.json(result);
      }
    });
});

// Create a new document under deneme/users.
recordRoutes.route("/users/addUser").post(function (req, res) {
  const dbConnect = dbo.getDb();

  const matchDocument = {
    userName: req.body.userName,
    eMail: req.body.eMail,
    password: req.body.password,
    lastModified: new Date(),
  };

  dbConnect
    .collection("users")
    .insertOne(matchDocument, function (err, result) {
      if (err) {
        res.status(400).send("Error adding user!");
      } else {
        console.log(`Added a new user with id ${result.insertedId}`);
        res.status(204).send();
      }
    });
});

// This section will help you update a document by id.
recordRoutes.route("/users/updateUser").post(function (req, res) {
  const dbConnect = dbo.getDb();
  const listingQuery = { _id: ObjectId(req.body.id) };
  const updates = {
    $set: {
      //$set for setting value $inc for incrementing value
      userName99: "500",
    },
  };

  dbConnect
    .collection("users")
    .updateOne(listingQuery, updates, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error updating likes on listing with id ${listingQuery.id}!`);
      } else {
        console.log("1 document updated");
      }
    });
});

// This section will help you delete a record.
recordRoutes.route("/users/delete/:id").delete((req, res) => {
  const dbConnect = dbo.getDb();
  const listingQuery = { listing_id: req.body.id };

  dbConnect
    .collection("listingsAndReviews")
    .deleteOne(listingQuery, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error deleting listing with id ${listingQuery.listing_id}!`);
      } else {
        console.log("1 document deleted");
      }
    });
});

module.exports = recordRoutes;
