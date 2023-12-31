

const express = require("express");
const router = express.Router();
const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getBookStores = async (req, res) => {
    //#swagger.tags=["bookStore"]
    const result = await mongodb.getDatabase().db().collection("bookStore").find();
    result.toArray().then((bookStore) => {
       res.setHeader("Content-Type", "application/json");
       res.status(200).json(bookStore);
    });
}

const getBookStore= async (req, res) => {
    //#swagger.tags=["bookStore"]
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection("bookStore").find({_id: userId});
    result.toArray().then((bookStore) => {
        if (bookStore.length > 0) {
            const bookStore = bookStore[0];
            res.status(200).json({ bookStore });
        } else {
            res.status(404).json("BookStore not found");
        }
    });
};


const createBookStore = async (req, res) => {
    //#swagger.tags=["bookStore"]
    
    const { name, location, phoneNumber } = req.body;

    //  validation
    if (!name || !location || !phoneNumber) {
      return res.status(400).json('Invalid data. All fields are required.');
    }

    const bookStore = {
        name: req.body.name,
        location: req.body.location,
        phoneNumber: req.body.phoneNumber

    };
    const response = await mongodb.getDatabase().db().collection("bookStore").insertOne(bookStore);
    if (response.acknowledged > 0) {
        res.status(204).send();
     } else {
        res.status(500).json(response.error || "Some error occurred while updating the bookStore.");
    }
};


const updateBookStore = async (req, res) => {
    //#swagger.tags=["bookStore"]
    const userId = new ObjectId(req.params.id);
    const bookStore = {
        name: req.body.name,
        location: req.body.location,
        phoneNumber: req.body.phoneNumber


    };

    const response = await mongodb.getDatabase().db().collection("bookStore").replaceOne({ _id: userId } ,bookStore);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || "Some error occurred while updating the bookStore.");
        };
}  

const deleteBookStore = async (req, res) => {
    //#swagger.tags=["bookStore"]
    try {
      const userId = new ObjectId(req.params.id);
      console.log("Deleting bookStore with ID:", userId); // line for debugging
      const response = await mongodb.getDatabase().db().collection("bookStore").deleteOne({ _id: userId });
  
      if (response.deletedCount > 0) {
        res.status(204).send();
      } else {
        res.status(404).json("bookStore not found");
      }
    } catch (error) {
      console.error("Error deleting bookStore:", error);
      res.status(500).json("Some error occurred while deleting the bookStore.");
    }
  };
  


module.exports = {
    getBookStores,
    getBookStore,
    createBookStore,
    updateBookStore,
    deleteBookStore,
};