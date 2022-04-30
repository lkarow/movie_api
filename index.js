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
    director: 'Takeshi Kitano',
    genre: 'Drama',
    description:
      'A young, naive boy sets out alone on the road to find his wayward mother. Soon he finds an unlikely protector in a crotchety man and the two have a series of unexpected adventures along the way.',
    img: 'https://upload.wikimedia.org/wikipedia/en/d/de/Kikujiro-1999-poster.jpg',
  },
  {
    title: 'Hana bi',
    director: '',
    genre: '',
    description: '',
    img: '',
  },
  {
    title: 'Tampopo',
    director: '',
    genre: '',
    description: '',
    img: '',
  },
  {
    title: 'Departures',
    director: '',
    genre: '',
    description: '',
    img: '',
  },
  {
    title: 'Spirited Away',
    director: '',
    genre: '',
    description: '',
    img: '',
  },
  {
    title: 'Piano Forest',
    director: '',
    genre: '',
    description: '',
    img: '',
  },
  {
    title: 'Our Little Sister',
    director: '',
    genre: '',
    description: '',
    img: '',
  },
  {
    title: 'Shoplifters',
    director: '',
    genre: '',
    description: '',
    img: '',
  },
  {
    title: 'My Neighbor Totoro',
    director: '',
    genre: '',
    description: '',
    img: '',
  },
  {
    title: 'Ghost in the Shell',
    director: '',
    genre: '',
    description: '',
    img: '',
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
  res.json(
    topMovies.find((movie) => {
      return movie.title === req.params.movieTitle;
    })
  );
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
