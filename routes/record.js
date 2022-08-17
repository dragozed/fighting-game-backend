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

recordRoutes.route("/villageStatus").get(async function (req, res) {
  const dbConnect = dbo.getDb();
  dbConnect
    .collection("villageStatus")
    .find({ userName: req.query.userName })
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
      } else {
        res.json(result);
      }
    });
});

recordRoutes.route("/inventory").get(async function (req, res) {
  const dbConnect = dbo.getDb();
  dbConnect
    .collection("inventory")
    .find({ userName: req.query.userName })
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
      } else {
        res.json(result);
      }
    });
});

// Create a new document under deneme/users and deneme/villageStatus.
recordRoutes.route("/users/createUser").post(function (req, res) {
  const dbConnect = dbo.getDb();

  const userDocument = {
    userName: req.body.userName,
    eMail: req.body.eMail,
    password: req.body.password,
    lastModified: new Date(),
  };

  dbConnect.collection("users").insertOne(userDocument, function (err, result) {
    if (err) {
      res.status(400).send("Error adding user!");
    } else {
      console.log(`Added a new user with id ${result.insertedId}`);
    }
  });
});

recordRoutes.route("/villageStatus/createStatus").post(function (req, res) {
  const dbConnect = dbo.getDb();

  const userDocument = {
    userName: req.body.userName,
    villageStatus: {
      wood: 0,
      stone: 0,
      iron: 0,
      trainingGroundsLevel: 0,
      trainingGroundsWoodReq: 5,
      trainingGroundsStoneReq: 5,
      trainingGroundsIronReq: 0,
    },
    lastModified: new Date(),
  };

  dbConnect
    .collection("villageStatus")
    .insertOne(userDocument, function (err, result) {
      if (err) {
        res.status(400).send("Error adding villageStatus!");
      } else {
        insertedId = result.insertedId;
        console.log(`Added a new villageStatus`);
      }
    });
});

recordRoutes.route("/inventory/createInventory").post(function (req, res) {
  const dbConnect = dbo.getDb();

  const userDocument = {
    userName: req.body.userName,
    inventory: {
      characters: ["Kong"],
      minions: ["Lizard Minion"],
    },
    lastModified: new Date(),
  };

  dbConnect
    .collection("inventory")
    .insertOne(userDocument, function (err, result) {
      if (err) {
        res.status(400).send("Error adding inventory!");
      } else {
        insertedId = result.insertedId;
        console.log(`Added a new inventory`);
      }
    });
});

// This section will help update a document by id.
recordRoutes.route("/users/updateUser").post(function (req, res) {
  const dbConnect = dbo.getDb();
  const listingQuery = { _id: ObjectId(req.body.id) };
  const updates = {
    $set: {
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

recordRoutes.route("/villageStatus/updateStatus").post(function (req, res) {
  const dbConnect = dbo.getDb();
  const listingQuery = { userName: req.body.userName };
  const updates = {
    $set: {
      villageStatus: req.body.villageStatus,
    },
  };

  dbConnect
    .collection("villageStatus")
    .updateOne(listingQuery, updates, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(
            `Error updating villageStatus for user ${listingQuery.userName}!`
          );
      } else {
        console.log("villageStatus updated");
      }
    });
});

recordRoutes.route("/inventory/updateInventory").post(function (req, res) {
  const dbConnect = dbo.getDb();
  const listingQuery = { userName: req.body.userName };
  const updates = {
    $set: {
      inventory: req.body.inventory,
    },
  };

  dbConnect
    .collection("inventory")
    .updateOne(listingQuery, updates, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error updating inventory for user ${listingQuery.userName}!`);
      } else {
        console.log("inventory updated");
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
