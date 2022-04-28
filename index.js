const express = require('express'),
  morgan = require('morgan'),
  fs = require('fs'),
  path = require('path');

const app = express();

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

// GET requests
app.get('/movies', (req, res) => {
  res.json(topMovies);
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
