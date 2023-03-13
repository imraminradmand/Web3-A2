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

  // Get movie by ID
  router.get("/movies/:id", async (req, res) => {
    const { id } = req.params;

    if (isNaN(id) || parseInt(id) < 1) {
      res.status(400).json({
        status: "Error",
        message: "Invalid movie ID",
      });
      return;
    }

    try {
      const cursor = db.collection("movies").find({ id: parseInt(id) });
      const results = await cursor.toArray();
      const filteredResults = results.map(({ _id, ...rest }) => rest);

      if (filteredResults.length === 0) {
        res.status(404).json({
          status: "Error",
          message: "Movie not found",
        });
      }

      res.status(200).json(filteredResults[0]);
    } catch (err) {
      res.status(500).json({
        status: "Error",
        message: "Internal server error",
      });
    }
  });

  // Get movies within year range
  router.get("/movies/year/:min/:max", async (req, res) => {
    const { min, max } = req.params;

    if (
      isNaN(min) ||
      isNaN(max) ||
      parseInt(min) < 1 ||
      parseInt(max) < 1 ||
      parseInt(min) > parseInt(max)
    ) {
      res.status(400).json({
        status: "Error",
        message: "Invalid year range",
      });
      return;
    }

    try {
      const cursor = db
        .collection("movies")
        .find({ release_date: { $gte: min, $lte: max } });
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

  return router;
};
