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

  return router;
};
