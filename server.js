require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const authJwtController = require('./auth_jwt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./Users');
const Movie = require('./Movies');
const Review = require('./Reviews')

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

const router = express.Router();

// Removed getJSONObjectForMovieRequirement as it's not used

router.post('/signup', async (req, res) => { // Use async/await
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ success: false, msg: 'Please include both username and password to signup.' }); // 400 Bad Request
  }

  try {
    const user = new User({ // Create user directly with the data
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
    });

    await user.save(); // Use await with user.save()

    res.status(201).json({ success: true, msg: 'Successfully created new user.' }); // 201 Created
  } catch (err) {
    if (err.code === 11000) { // Strict equality check (===)
      return res.status(409).json({ success: false, message: 'A user with that username already exists.' }); // 409 Conflict
    } else {
      console.error(err); // Log the error for debugging
      return res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' }); // 500 Internal Server Error
    }
  }
});


router.post('/signin', async (req, res) => { // Use async/await
  try {
    const user = await User.findOne({ username: req.body.username }).select('name username password');

    if (!user) {
      return res.status(401).json({ success: false, msg: 'Authentication failed. User not found.' }); // 401 Unauthorized
    }

    const isMatch = await user.comparePassword(req.body.password); // Use await

    if (isMatch) {
      const userToken = { id: user._id, username: user.username }; // Use user._id (standard Mongoose)
      const token = jwt.sign(userToken, process.env.SECRET_KEY, { expiresIn: '1h' }); // Add expiry to the token (e.g., 1 hour)
      res.json({ success: true, token: 'JWT ' + token });
    } else {
      res.status(401).json({ success: false, msg: 'Authentication failed. Incorrect password.' }); // 401 Unauthorized
    }
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' }); // 500 Internal Server Error
  }
});

router.route('/movies')
  .get(authJwtController.isAuthenticated, async (req, res) => {
    try {
      const movies = await Movie.find(); // Changed from findOne() to find() to get all movies
      if (movies.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No movies in db",
          movies: []
        });
      }
      return res.status(200).json({ success: true, movies: movies });
    }
    catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Error fetching movies from db",
      });
    }
  })
  .post(authJwtController.isAuthenticated, async (req, res) => {
    try {
      if (!req.body.title || !req.body.releaseDate || !req.body.genre || !req.body.actors) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields: title, releaseDate, genre, and actors.'
        });
      }

      if (!Array.isArray(req.body.actors) || req.body.actors.length < 3) {
        return res.status(400).json({
          success: false,
          message: 'Please provide at least 3 actors in the actors array.'
        });
      }

      for (let i = 0; i < req.body.actors.length; i++) {
        if (!req.body.actors[i].actorName || !req.body.actors[i].characterName) {
          return res.status(400).json({
            success: false,
            message: 'Each actor must have both actorName and characterName.'
          });
        }
      }

      const newMovie = new Movie({
        title: req.body.title,
        releaseDate: req.body.releaseDate,
        genre: req.body.genre,
        actors: req.body.actors
      });

      await newMovie.save();

      res.status(201).json({
        success: true,
        message: 'Movie created successfully!',
        movie: newMovie
      });
    } catch (err) {
      console.error(err);
      if (err.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error: ' + err.message
        });
      }
      res.status(500).json({
        success: false,
        message: 'Error saving movie to database.'
      });
    }
  });

// Routes for movies/parameter title in my case

router.route('/movies/:title')
  .get(authJwtController.isAuthenticated, async (req, res) => {
    try {
      // check if reviews=true was passed as query param
      if (req.query.reviews === 'true') {
        // do the $lookup aggregation to join movie + reviews
        const movieWithReviews = await Movie.aggregate([
          { $match: { title: req.params.title } },
          {
            $lookup: {
              from: 'reviews',        // the Reviews collection name in MongoDB
              localField: '_id',      // Movie's _id
              foreignField: 'movieId', // Review's movieId field
              as: 'reviews'           // attach results as 'reviews' array
            }
          }
        ]);

        if (!movieWithReviews.length) {
          return res.status(404).json({ success: false, message: 'Movie not found.' });
        }

        return res.status(200).json({ success: true, movie: movieWithReviews[0] });

      } else {
        const movie = await Movie.findOne({ title: req.params.title });
        if (!movie) {
          return res.status(404).json({ success: false, message: 'Movie not found.' });
        }
        return res.status(200).json({ success: true, movie: movie });
      }

    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  })


  .put(authJwtController.isAuthenticated, async (req, res) => {
    try {
      const movie = await Movie.findOne({ title: req.params.title });

      if (!movie) {
        return res.status(404).json({
          success: false,
          message: 'Movie not found.'
        });
      }

      if (req.body.actors) {
        if (!Array.isArray(req.body.actors) || req.body.actors.length < 3) {
          return res.status(400).json({
            success: false,
            message: 'Please provide at least 3 actors in the actors array.'
          });
        }

        for (let i = 0; i < req.body.actors.length; i++) {
          if (!req.body.actors[i].actorName || !req.body.actors[i].characterName) {
            return res.status(400).json({
              success: false,
              message: 'Each actor must have both actorName and characterName.'
            });
          }
        }
      }

      if (req.body.title) movie.title = req.body.title;
      if (req.body.releaseDate) movie.releaseDate = req.body.releaseDate;
      if (req.body.genre) movie.genre = req.body.genre;
      if (req.body.actors) movie.actors = req.body.actors;

      await movie.save();

      res.status(200).json({
        success: true,
        message: 'Movie updated successfully!',
        movie: movie
      });

    } catch (err) {
      console.error(err);

      if (err.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error: ' + err.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error updating movie in database.'
      });
    }
  })
  .delete(authJwtController.isAuthenticated, async (req, res) => {
    try {
      const movie = await Movie.findOneAndDelete({ title: req.params.title });

      if (!movie) {
        return res.status(404).json({
          success: false,
          message: 'Movie not found.'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Movie deleted successfully!',
        movie: movie
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'Error deleting movie from database.'
      });
    }
  })
  .post(authJwtController.isAuthenticated, async (req, res) => {
    res.status(405).json({
      success: false,
      message: 'POST method not supported on this route. Use POST /movies instead.'
    });
  });

// reviews route

router.route('/reviews')
  .get(authJwtController.isAuthenticated, async (req, res) => {
    const reviews = await Review.find();
    try {
      if (reviews.length === 0) {
        return res.status(200).json({
          success: 'true',
          message: 'No reviews available',
          reviews: []
        });
      }
      return res.status(200).json({ success: 'true', reviews: reviews });
    }
    catch (err) {
      return res.status(500).json({
        success: 'false',
        message: err.message
      });
    }
  })
  .post(authJwtController.isAuthenticated, async (req, res) => {
    try {
      if (!req.body.movieId || !req.body.username || !req.body.review || !req.body.rating) {
        return res.status(400).json({
          success: 'false',
          message: 'invalid post request. Not all fileds provided.'
        })
      }
      const newReview = new Review({
        movieId: req.body.movieId,
        username: req.body.username,
        review: req.body.review,
        rating: req.body.rating
      });
      await newReview.save();
      return res.status(200).json({ success: 'true', message: 'Review created!' });
    }
    catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({
          success: 'false',
          message: err.message
        })
      }
      return res.status(500).json({
        success: 'false',
        message: 'Error saving review'
      });
    }
  })

  .delete(authJwtController.isAuthenticated, async (req, res) => {
    try {
      const review = await Review.findOneAndDelete({ movieId: req.body.movieId });
      if (!review) {
        return res.status(404).json({
          success: 'false',
          message: 'cannot find review'
        });
      }
      return res.status(200).json({
        success: 'true',
        message: 'Review successfully deleted',
        review: req.body.movieId
      });
    }
    catch (err) {
      return res.status(500).json({
        success: 'false',
        message: err.message
      });
    }
  });

app.use('/', router);

const PORT = process.env.PORT || 8080; // Define PORT before using it
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // for testing only
