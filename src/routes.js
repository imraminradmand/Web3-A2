const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // Get all movies
  router.get("/movies", async (req, res) => {
    try {
      const cursor = db.collection("movies").find();
      const results = await cursor.toArray();
      const filteredResults = results.map(({ _id, ...rest }) => rest);

      if (filteredResults.length === 0) {
        res.status(404).json({
          status: "Error",
          message: "No movies found",
        });
      }
      res.status(200).json(filteredResults);
    } catch (err) {
      res.status(500).json({
        status: "Error",
        message: "Internal server error",
      });
    }
  });

  // Get number of movies
  router.get("/movies/limit/:num", async (req, res) => {
    const { num } = req.params;

    if (isNaN(num) || parseInt(num) < 1) {
      res.status(400).json({
        status: "Error",
        message: "Invalid number of movies requested",
      });
      return;
    }

    try {
      const cursor = db.collection("movies").find().limit(parseInt(num));
      const results = await cursor.toArray();
      const filteredResults = results.map(({ _id, ...rest }) => rest);

      if (filteredResults.length === 0) {
        res.status(404).json({
          status: "Error",
          message: "No movies found",
        });
      }

      res.status(200).json(filteredResults.slice(0, num));
    } catch (err) {
      res.status(500).json({
        status: "Error",
        message: "Internal server error",
      });
    }
  });

  return router;
};
