const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Models = require('./models.js');

const Movies = Models.Movie,
    Users = Models.User,
    Genres = Models.Genre,
    Directors = Models.Director;

const app = express(),
  port = 8080, // API server runs on port 8080
  uuid = require('uuid');

// Connect to MongoDB (on port 27017)
mongoose.connect('mongodb://localhost:27017/myFlix', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

app.use(bodyParser.urlencoded({
    extended: true
}));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Define a simple route for testing
app.get('/', (req, res) => {
  res.send('Hello from the API!');
});

// Start the Express server
app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});

app.use(morgan('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static request
app.use(express.static('public'));

// Return a list of ALL movies to the user	
app.get('/movies', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user	
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), async (req, res) => {
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

// Return data about a genre (description) by name/title (e.g., “Thriller”)	
app.get('/genres/:Name', passport.authenticate('jwt', { session: false }), async (req, res) => {
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

// Return data about a director (bio, birth year, death year) by name	
app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ 'Director.Name': req.params.Name })
        .then((director) => {
            if (director) {
                res.json(director.Director);
            } else {
                res.status(404).send(
                    'Director with the name ' +
                        req.params.Name +
                        ' was not found.'
                );
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get all users
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.find()
  .then((users) => {
          res.json(users);
      })
      .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
      });
});

// Allow new users to register
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

// Allow users to add a movie to their list of favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
       $push: { FavoriteMovies: req.params.MovieID }
     },
     { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

// Allow users to update their user info (username)
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
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
      res.status(500).send('Error: ' + err);
    })
  });

app.get('/', (req, res) => {
    res.send('Welcome to my movie club!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

// Allow users to remove a movie from their list of favorites
app.delete('/users/:Username/favorites/:movieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOneAndUpdate(
        {
            Username: req.params.Username,
            FavoriteMovies: req.params.movieID,
        },
        {
            $pull: { FavoriteMovies: req.params.movieID },
        },
        { new: true }
    )
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Allow existing users to deregister	
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOneAndDelete({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found.');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});