const express = require('express'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    Models = require('./models.js');

const app = express(),
uuid = require('uuid');

mongoose.connect('mongodb://localhost:27017/dbname', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(morgan('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static request
app.use(express.static('public'));

// CREATE new user
app.post('/users', async (req, res) => {
    await Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: req.body.Password,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

// UPDATE the username of a user
app.put('/users/:Username', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(‘Error: ’ + err);
    })
  });

// CREATE Allow users to add a movie to their list of favorites
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
       $push: { FavoriteMovies: req.params.MovieID }
     },
     { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(‘Error: ’ + err);
    });
  });

/*
app.get('/', (req, res) => {
    res.send('Welcome to my movie club!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});
*/

// READ list of data about ALL movies
app.get('/movies', async (req, res) => {
    await Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// READ data about a single movie, by title
app.get('/movies/:Title', async (req, res) => {
    await Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            if (movie) {
                res.json(movie);
            } else {
                res.status(404).send(
                    'Movie with the title ' +
                        req.params.Title +
                        ' was not found.'
                );
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// GET a genre by name
app.get('/genres/:Name', async (req, res) => {
    await Movies.findOne({ 'Genre.Name': req.params.Name })
        .then((genre) => {
            if (genre) {
                res.json(genre.Genre);
            } else {
                res.status(404).send(
                    'Genre with the name ' + req.params.Name + ' was not found.'
                );
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// READ the director of a movie
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find(movie => movie.Director.Name == directorName).Director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('no such director')
    }
});

// DELETE Allow users to remove a movie from their list of favorites
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
  
    let user = users.find( user => user.id == id );

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
    } else {
        res.status(400).send('no such user');
    }
  });

// DELETE Allow existing users to deregister 
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
  
    let user = users.find( user => user.id == id );

    if (user) {
        users = users.filter( user => user.id != id);
        res.status(200).send(`user ${id} has been deleted`);
    } else {
        res.status(400).send('no such user');
    }
  });

// error handling
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});