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

let topMovies = [
  {
    title: 'Kikujiros Summer',
  },
  {
    title: 'Hana bi',
  },
  {
    title: 'Tampopo',
  },
  {
    title: 'Departures',
  },
  {
    title: 'Spirited Away',
  },
  {
    title: 'Piano Forest',
  },
  {
    title: 'Our Little Sister',
  },
  {
    title: 'Shoplifters',
  },
  {
    title: 'My Neighbor Totoro',
  },
  {
    title: 'Ghost in the Shell',
  },
];

let users = [
  {
    id: 1,
    name: 'test name',
    mail: 'test mail',
  },
];

// get all movies
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

// get data about a single movie
app.get('/movies/:movieTitle', (req, res) => {
  res.send('Successful GET request returning data about SINGLE MOVIE');
});

// get data about genre
app.get('/genres/:genreTitle', (req, res) => {
  res.send('Successful GET request returning data about a GENRE');
});

// get data about director
app.get('/directors/:name', (req, res) => {
  res.send('Successfull GET request returning data about DIRECTOR');
});

// add new user
app.post('/users', (req, res) => {
  let newUser = req.body;

  if (!newUser.name) {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).send(newUser);
  }
});

// change user name
app.put('/users/:id/:newUserName', (req, res) => {
  res.send('Successfull PUT request CHANGING user name');
});

// add movie to favorites list of user
app.put('/users/:id/movies/:movieTitle', (req, res) => {
  res.send('Successfull PUT request ADDING MOVIE to favorite list');
});

// delete movie from favorite list of user
app.delete('/users/:id/movies/:movieTitle', (req, res) => {
  res.send('Successfull DELETE request REMOVING MOVIE to favorite list');
});

// delete user
app.delete('/users/:id/', (req, res) => {
  res.send('Successful DELETE request REMOVING USER');
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
