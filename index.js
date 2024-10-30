const express = require('express'),
morgan = require('morgan');

const app = express();
const bodyParser = require('body-parser'),
methodOverride = require('method-override');

app.use(morgan('common'));

let topMovies = [
    {
        title: 'The Godfather',
        year: '1972'
    },
    {
        title: 'Chungking Express',
        year: '1994'
    },
    {
        title: "You've Got Mail",
        year: '1998'
    },
    {
        title: 'Pulp Fiction',
        year: '1994'
    },
    {
        title: 'Go',
        year: '1999'
    },
    {
        title: 'The Lady Vanishes',
        year: '1938'
    },
    {
        title: 'A Little Princess',
        year: '1995'
    },
    {
        title: 'Scarface',
        year: '1983'
    },
    {
        title: 'Looper',
        year: '2012'
    },
    {
        title: 'Saltburn',
        year: '2023'
    }    
];

// GET requests
app.get('/', (req, res) => {
    res.send('Welcome to my movie club!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

// static request
app.use(express.static('public'));

// error handling
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});