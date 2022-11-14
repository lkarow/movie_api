const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// mongoose.connect locally
// mongoose.connect('mongodb://localhost:27017/myFlixDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const express = require('express'),
  morgan = require('morgan'),
  fs = require('fs'),
  path = require('path'),
  bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const cors = require('cors');
let allowedOrigins = [
  'https://myflix-501fc4.netlify.app',
  'https://myflix-501fc4.netlify.app/',
  'https://lkarow.github.io',
  'https://lkarow.github.io/',
  'https://lkarow.github.io/myFlix-Angular-client',
  'https://lkarow.github.io/myFlix-Angular-client/',
  'http://localhost:1234',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If a specific origin isn’t found on the list of allowed origins
        let message = `The CORS policy for this application doesn't allow access from origin ${origin}`;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

require('./auth')(app);
const passport = require('passport');
require('./passport');

const { check, validationResult } = require('express-validator');

// create a write stream in log.txt
const accessLogStream = fs.createWriteStream('/tmp/log.txt', {
  flags: 'a',
});

// logger setup
app.use(morgan('common', { stream: accessLogStream }));

/**
 * Get data of all movies
 * Endpoint: /movies
 * HTTP method: GET
 * @name getAllMovies
 * @returns JSON object holding data of all movies
 * @requires passport
 */
app.get(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  }
);

/**
 * Get data of a single movie
 * Endpoint: /movies/[movie ID]
 * HTTP method: GET
 * @name getMovie
 * @returns JSON object holding data about a movie containing description, genre, director, image URL
 * @requires passport
 */
app.get(
  '/movies/:MovieTitle',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.MovieTitle })
      .then((movie) => {
        res.status(201).json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  }
);

/**
 * Get data of a genre
 * Endpoint: /genres/[genre name]
 * HTTP method: GET
 * @name getGenre
 * @returns JSON object holding data about a genre
 * @requires passport
 */
app.get(
  '/genres/:GenreName',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.GenreName })
      .then((movie) => {
        if (movie) {
          res.status(201).json(movie.Genre);
        } else {
          res.status(400).send(`Genre was not found.`);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  }
);

/**
 * Get data of a director
 * Endpoint: /directors/[name]
 * HTTP method: GET
 * @name getDirector
 * @returns JSON object holding data about a director including bio, birth year, death year
 * @requires passport
 */
app.get(
  '/directors/:DirectorName',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.DirectorName })
      .then((movie) => {
        if (movie) {
          res.status(201).json(movie.Director);
        } else {
          res.status(400).send(`Director was not found.`);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  }
);

/**
 * Get data of a single user
 * Endpoint: /users/[username]
 * HTTP method: GET
 * @name getUser
 * @returns JSON object holding the data about the user
 * @requires passport
 */
app.get(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .populate('FavoriteMovies', 'Title')
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  }
);

/**
 * Add new user
 * Endpoint: /users
 * HTTP method: POST
 * Request body data format: JSON object holding data about the new user including username and mail
 * Expect JSON in this format:
 * {
 *  ID: Integer,
 *  Username: String, (required)
 *  Password: String, (required)
 *  Email: String, (required)
 *  Birthday: Date
 * }
 * @get addUser
 * @returns JSON object holding data about the new user including ID, username and mail
 */
app.post(
  '/users',
  // validation logic here for request
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check(
      'Username',
      'Username contains non alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  (req, res) => {
    // check validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(`${req.body.Username} already exists.`);
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((err) => {
              console.error(err);
              res.status(500).send(`Error: ${err}`);
            });
        }
      })
      .catch((err) => {
        console.error(err);
        res.statuts(500).send(`Error: ${err}`);
      });
  }
);

/**
 * Update user data
 * Endpoint: /users/[username]
 * HTTP method: PUT
 * Request body data format: JSON object with the new user infos
 * Expect JSON in this format:
 * {
 *  Username: String, (required)
 *  Password: String, (required)
 *  Email: String, (required)
 *  Birthday: Date
 * }
 * @name updateUser
 * @returns JSON object holding the data about the new user
 * @requires passport
 */
app.put(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true } // line makes sure that the update document is returned
    )
      .then((updateUser) => {
        res.status(201).json(updateUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  }
);

/**
 * Add movie to favorite list of user
 * Endpoint: /users/[username]/movies/[movie ID]
 * HTTP method: PUT
 * @name addMovieToFavorites
 * @returns JSON object holding the new data about the user
 * @requires passport
 */
app.put(
  '/users/:Username/movies/:MovieId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $addToSet: { FavoriteMovies: req.params.MovieId } },
      { new: true } // line makes sure that the update document is returned
    )
      .populate('FavoriteMovies', 'Title')
      .then((updateUser) => {
        res.status(201).json(updateUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  }
);

/**
 * Remove movie from favorite list of user
 * Endpoint: /users/[username]/movies/[movie ID]
 * HTTP method: DELETE
 * @name removeMovieFromFavorites
 * @returns JSON object holding the data about the user without the deleted movie
 * @requires passport
 */
app.delete(
  '/users/:Username/movies/:MovieId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieId } },
      { new: true } // line makes sure that the update document is returned
    )
      .populate('FavoriteMovies', 'Title')
      .then((updateUser) => {
        res.status(201).json(updateUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  }
);

/**
 * Delete user
 * Endpoint: /users/[username]
 * HTTP method: DELETE
 * @name deleteUser
 * @returns {string} text message
 * @requires passport
 */
app.delete(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(`${req.params.Username} was not found.`);
        } else {
          res.status(200).send(`${req.params.Username} was deleted.`);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  }
);

app.get('/', (req, res) => {
  res.send('Welcome to the movie club!');
});

app.use(express.static('public'));

// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Listening on Port ' + port));

module.exports = app;
