const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const express = require('express'),
  morgan = require('morgan'),
  fs = require('fs'),
  path = require('path'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const app = express();

app.use(bodyParser.json());

// create a write stream in log.txt
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
  flags: 'a',
});

// logger setup
app.use(morgan('common', { stream: accessLogStream }));

// get all movies
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// get data about a single movie
app.get('/movies/:MovieTitle', (req, res) => {
  Movies.findOne({ Title: req.params.MovieTitle })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// get data about genre
app.get('/genres/:GenreName', (req, res) => {
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
});

// get data about director
app.get('/directors/:DirectorName', (req, res) => {
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
});

// get one user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// add new user
/* we'll expect JSON in this format
{
  ID: Integer,
  Username: String, 
  Password: String, 
  Email: String,
  Birthday: Date
}
*/
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(`${req.body.Username} already exists.`);
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
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
});

// update user's info by username
/* we'll expect JSON in the format
{
  Username: String, (required)
  Password: String, (required)
  Email: String, (required)
  Birthday: Date
}
*/
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
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
});

// add movie to favorites list of user
app.put('/users/:Username/movies/:MovieId', (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $addToSet: { FavoriteMovies: req.params.MovieId } },
    { new: true } // line makes sure that the update document is returned
  )
    .then((updateUser) => {
      res.status(201).json(updateUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// delete movie from favorite list of user
app.delete('/users/:Username/movies/:MovieId', (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $pull: { FavoriteMovies: req.params.MovieId } },
    { new: true } // line makes sure that the update document is returned
  )
    .then((updateUser) => {
      res.status(201).json(updateUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// delete user by username
app.delete('/users/:Username', (req, res) => {
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
});

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
app.listen(8080, () => {
  console.log('Listening on port 8080.');
});
