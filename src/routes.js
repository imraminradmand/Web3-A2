const { parse } = require("dotenv");
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

	// Get movies by tmdb id
	router.get("/movies/tmdb/:tmdbId", async (req, res) => {
		const { tmdbId } = req.params;

		if (tmdbId === undefined || tmdbId === "") {
			res.status(400).json({
				status: "Error",
				message: "Invalid movie TMDB ID",
			});
			return;
		}

		try {
			const cursor = db
				.collection("movies")
				.find({ tmdb_id: parseInt(tmdbId) });
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

	// Get movies by within rating range

	router.get("/movies/ratings/:min/:max", async (req, res) => {
		const { min, max } = req.params;

		if (
			isNaN(min) ||
			isNaN(max) ||
			min < 0 ||
			max < 0 ||
			min > 10 ||
			max > 10 ||
			min > max
		) {
			res.status(400).json({
				status: "Error",
				message: "Invalid rating range",
			});
			return;
		}

		try {
			const cursor = db.collection("movies").find({
				"ratings.average": { $gte: parseFloat(min), $lte: parseFloat(max) },
			});
			const results = await cursor.toArray();
			const filteredResults = results.map(({ _id, ...rest }) => rest);

			if (filteredResults.length === 0) {
				//ERRORING OUT HERE
				//WHEN I GET A LIST THAT IS EMPTY, IT CRASHES
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

	// Get movies by title contains

	router.get("/movies/title/:text", async (req, res) => {
		const { text } = req.params;
		lowerText = text.toLowerCase();

		if (lowerText === undefined || lowerText === "") {
			res.status(400).json({
				status: "Error",
				message: "Invalid movie title",
			});
			return;
		}

		try {
			// STILL NEED TO FIGURE OUT HOW TO FIND IT IF IT CONTAIN THE WORD NOT JUST AT THE BEGINNING
			const cursor = db.collection("movies").find({
				title: { $regex: new RegExp(lowerText, "i") },
			});

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

	// Get movies by genre

	return router;
};
