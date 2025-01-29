const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Models = require('./models.js');

const { check, validationResult } = require('express-validator');

const Movies = Models.Movie,
    Users = Models.User,
    Genres = Models.Genre,
    Directors = Models.Director;

const app = express();

// Connect to MongoDB (on port 27017)
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(morgan("common"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
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
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});

// Static files
app.use(express.static('public'));

// CREATE a new user
app.post('/users',
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const hashedPassword = Users.hashPassword(req.body.Password);

    try {
      const existingUser = await Users.findOne({ Username: req.body.Username });

      if (existingUser) {
        return res.status(400).send(`${req.body.Username} already exists.`);
      }

      const newUser = await Users.create({
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      });

      res.status(201).json(newUser);

    } catch (error) {
      console.error(error);
      res.status(500).send(`Error: ${error}`);
    }
  }
);

// UPDATE user info
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission denied');
  }

  try {
    const updatedUser = await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error: ${err}`);
  }
});

// Add movie to user's favorite list
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const updatedUser = await Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $push: { FavoriteMovies: req.params.MovieID } },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error: ${err}`);
  }
});

// READ routes

// Root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to my Movie App!');
});

// Get user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await Users.findOne({ Username: req.params.Username });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.json(user); // Send user data as a JSON response
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error: ${err}`);
  }
});

// Get all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movies = await Movies.find();
    res.status(200).json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error: ${err}`);
  }
});

// Get movie by title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movie = await Movies.findOne({ Title: req.params.Title });

    if (!movie) {
      return res.status(404).send(`Movie with title '${req.params.Title}' not found.`);
    }

    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error: ${err}`);
  }
});

// Get movies by genre
app.get('/movies/genres/:Name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movie = await Movies.findOne({ 'Genre.Name': req.params.Name });

    if (!movie) {
      return res.status(404).send(`Genre '${req.params.Name}' not found.`);
    }

    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error: ${err}`);
  }
});

// Get movies by director
app.get('/movies/directors/:Name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movie = await Movies.findOne({ 'Director.Name': req.params.Name });

    if (!movie) {
      return res.status(404).send(`Director '${req.params.Name}' not found.`);
    }

    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error: ${err}`);
  }
});

// DELETE routes

// Remove movie from user's favorites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const updatedUser = await Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error: ${err}`);
  }
});

// Delete user
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await Users.findOneAndDelete({ Username: req.params.Username });

    if (!user) {
      return res.status(400).send(`${req.params.Username} was not found`);
    }

    res.status(200).send(`${req.params.Username} was deleted.`);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error: ${err}`);
  }
});
