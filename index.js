const express = require('express'),
morgan = require('morgan');

const app = express();
const bodyParser = require('body-parser'),
methodOverride = require('method-override'),
uuid = require('uuid');

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(methodOverride());

let users = [
    {
        id: 1,
        name: "Jane",
        favoriteMovies: []
    },
    {
        id: 2,
        name: "Tom",
        favoriteMovies: ["Pulp Fiction"]
    }
]

let movies = [
    {
        "Title":"The Godfather",
        "Description": "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
        "Genre": {
            "Name": "Drama",
            "Description": "The drama genre is a broad category that features stories portraying human experiences, emotions, conflicts, and relationships in a realistic and emotionally impactful way." 
        },
        "Director": {
            "Name": "Francis Ford Coppola",
            "Bio": "Francis Ford Coppola was born in 1939 in Detroit, Michigan, but grew up in a New York suburb in a creative, supportive Italian-American family. His father, Carmine Coppola, was a composer and musician. His mother, Italia Coppola (née Pennino), had been an actress. Francis Ford Coppola graduated with a degree in drama from Hofstra University, and did graduate work at UCLA in filmmaking. He was training as assistant with filmmaker Roger Corman, working in such capacities as sound-man, dialogue director, associate producer and, eventually, director of Dementia 13 (1963), Coppola's first feature film. ",
            "Birth": "April 7, 1939" 
        },
        "ImageURL":"https://m.media-amazon.com/images/M/MV5BMTM5NDU3OTgyNV5BMl5BanBnXkFtZTcwMzQxODA0NA@@._V1_.jpg",
        "Featured":true
    },
    {
        "Title":"Chungking Express",
        "Description": "Two melancholic Hong Kong policemen fall in love: one with a mysterious female underworld figure, the other with a beautiful and ethereal waitress at a late-night restaurant he frequents.",
        "Genre": {
            "Name": "Drama",
            "Description": "The drama genre is a broad category that features stories portraying human experiences, emotions, conflicts, and relationships in a realistic and emotionally impactful way." 
        },
        "Director": {
            "Name": "Kar-Wai Wong",
            "Bio": "Wong Kar-wai (born 17 July 1956) is a Hong Kong Second Wave filmmaker, internationally renowned as an auteur for his visually unique, highly stylised, emotionally resonant work, including Ah fei zing zyun (1990), Dung che sai duk (1994), Chung Hing sam lam (1994), Do lok tin si (1995), Chun gwong cha sit (1997), 2046 (2004) and My Blueberry Nights (2007), Yi dai zong shi (2013).",
            "Birth": "July 17, 1956" 
        },
        "ImageURL":"https://m.media-amazon.com/images/M/MV5BMTY4MTQyMjI4NV5BMl5BanBnXkFtZTcwNDk2MzQ2MQ@@._V1_.jpg",
        "Featured":true
    },
    {
        "Title":"You've Got Mail",
        "Description": "Book superstore magnate Joe Fox and independent book shop owner Kathleen Kelly fall in love in the anonymity of the Internet, both blissfully unaware that he's trying to put her out of business.",
        "Genre": {
            "Name": "Comedy",
            "Description": "The comedy genre refers to a category of entertainment that aims to amuse and entertain audiences by using humor, wit, and comedic situations." 
        },
        "Director": {
            "Name": "Nora Ephron",
            "Bio": "Nora Ephron was educated at Wellesley College, Massachusetts. She was an acclaimed essayist (Crazy Salad 1975), novelist (Heartburn 1983), and had written screenplays for several popular films, all featuring strong female characters, such as anti-nuclear activist Karen Silkwood (Silkwood (1983), co-written with Alice Arlen) and a mobster's feisty independent daughter Cookie Voltecki (Cookie (1989), also co-written with Arlen).",
            "Birth": "May 19, 1941" 
        },
        "ImageURL":"https://m.media-amazon.com/images/M/MV5BMjE0MTEyNDE0M15BMl5BanBnXkFtZTcwNzA5NjQwOA@@._V1_.jpg",
        "Featured":false
    },
    {
        "Title":"Pulp Fiction",
        "Description": "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
        "Genre": {
            "Name": "Drama",
            "Description": "The drama genre is a broad category that features stories portraying human experiences, emotions, conflicts, and relationships in a realistic and emotionally impactful way." 
        },
        "Director": {
            "Name": "Quentin Tarantino",
            "Bio": "Quentin Jerome Tarantino was born in Knoxville, Tennessee. His father, Tony Tarantino, is an Italian-American actor and musician from New York, and his mother, Connie (McHugh), is a nurse from Tennessee. Quentin moved with his mother to Torrance, California, when he was four years old. In January of 1992, first-time writer-director Tarantino's Reservoir Dogs (1992) appeared at the Sundance Film Festival.",
            "Birth": "March 27, 1963" 
        },
        "ImageURL":"https://m.media-amazon.com/images/M/MV5BMTgyMjI3ODA3Nl5BMl5BanBnXkFtZTcwNzY2MDYxOQ@@._V1_.jpg",
        "Featured":true
    },
    {
        "Title":"Go",
        "Description": "The aftermath of a drug deal as told from three different points of view.",
        "Genre": {
            "Name": "Dark Comedy",
            "Description": "The dark comedy subgenre, also known as black comedy, combines humor with elements of tragedy, morbidity, or darker themes. " 
        },
        "Director": {
            "Name": "Doug Liman",
            "Bio": "Douglas Eric Liman is a Jewish-American filmmaker and producer who directed Swingers, The Bourne Identity, Chaos Walking, Jumper, Go, Mr. & Mrs. Smith, Fair Game, Locked Down, Edge of Tomorrow, The Wall and American Made. He executive produced the Bourne sequels except The Bourne Legacy, The Phantom and The Killing Floor.",
            "Birth": "July 24, 1965" 
        },
        "ImageURL":"https://m.media-amazon.com/images/M/MV5BODk4MjIwNjU5OF5BMl5BanBnXkFtZTcwODU4Njk1Mw@@._V1_FMjpg_UX1000_.jpg",
        "Featured":false
    },
    {
        "Title":"The Lady Vanishes",
        "Description": "While travelling in continental Europe, a rich young playgirl realizes that an elderly lady seems to have disappeared from the train.",
        "Genre": {
            "Name": "Thriller",
            "Description": "The thriller genre features suspense, tension, and excitement. These stories are known for keeping audiences on the edge of their seats and delivering intense emotional experiences by revolving around high-stakes situations, dangerous conflicts, and the constant anticipation of unexpected events." 
        },
        "Director": {
            "Name": "Alfred Hitchcock",
            "Bio": "The thriller genre features suspense, tension, and excitement. These stories are known for keeping audiences on the edge of their seats and delivering intense emotional experiences by revolving around high-stakes situations, dangerous conflicts, and the constant anticipation of unexpected events.",
            "Birth": "August 13, 1899" 
        },
        "ImageURL":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTJqncGV3elrJcj28HM8p3V4PLZ2BdXaMDxQ&s",
        "Featured":true
    },
    {
        "Title":"A Little Princess",
        "Description": "Sara is sent to a strict boarding school after her father enlists in WWI. When he is presumed dead, the headmistress, knowing she will not receive any more money, forces the girl to become a servant.",
        "Genre": {
            "Name": "Drama",
            "Description": "The drama genre is a broad category that features stories portraying human experiences, emotions, conflicts, and relationships in a realistic and emotionally impactful way." 
        },
        "Director": {
            "Name": "Alfonso Cuarón",
            "Bio": "Alfonso Cuarón Orozco was born on November 28th 1961 in Mexico City, Mexico. From an early age, he yearned to be either a film director or an astronaut. However, he did not want to enter the army, so he settled for directing. He didn't receive his first camera until his twelfth birthday, and then immediately started to film everything he saw, showing it afterwards to everyone. ",
            "Birth": "Novemberr 28, 1961" 
        },
        "ImageURL":"https://m.media-amazon.com/images/M/MV5BMjA0ODY4OTk4Nl5BMl5BanBnXkFtZTcwNTkxMzYyMg@@._V1_.jpg",
        "Featured":true
    },
    {
        "Title":"Scarface",
        "Description": "Miami in the 1980s: a determined criminal-minded Cuban immigrant becomes the biggest drug smuggler in Florida, and is eventually undone by his own drug addiction.",
        "Genre": {
            "Name": "Drug Crime",
            "Description": "The drug crime subgenre features criminal activities related to illegal drugs, drug trafficking, drug abuse, and the efforts of law enforcement to combat the drug trade. These narratives often explore the consequences of drug-related criminal behavior, the impact on individuals and communities, and the challenges faced by those seeking to bring criminals to justice." 
        },
        "Director": {
            "Name": "Brian De Palma",
            "Bio": "Brian De Palma is one of the well-known directors who spear-headed the new movement in Hollywood during the 1970s. He is known for his many films that go from violent pictures, to Hitchcock-like thrillers.",
            "Birth": "September 11, 1940" 
        },
        "ImageURL":"https://m.media-amazon.com/images/M/MV5BMTI2ODQ0NDY3OV5BMl5BanBnXkFtZTYwNjAxNTM0._V1_.jpg",
        "Featured":false
    },
    {
        "Title":"Looper",
        "Description": "In 2074, when the mob wants to get rid of someone, the target is sent into the past, where a hired gun awaits - someone like Joe - who one day learns the mob wants to 'close the loop' by sending back Joe's future self for assassination.",
        "Genre": {
            "Name": "Cyberpunk",
            "Description": "The cyberpunk subgenre features high-tech, dystopian futures, advanced technology, and the intersection of human life with powerful corporations and cybernetics. " 
        },
        "Director": {
            "Name": "Rian Johnson",
            "Bio": "Rian Johnson was born in Maryland and at a young age his family moved to San Clemente, California, where he was raised. After graduating from high school, he went on to attend the University of Southern California School of Cinematic Arts. His first feature film, Brick (2005), was released in 2005 and was the metaphorical building block that launched his career. He is a director, writer, and musician, among other areas of expertise.",
            "Birth": "December 17, 1973" 
        },
        "ImageURL":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiZ1Rg46qz_EgfC6izI_mB7nfVqraioUGpaA&s",
        "Featured":false
    },
    {
        "Title":"Saltburn",
        "Description": "A student at Oxford University finds himself drawn into the world of a charming and aristocratic classmate, who invites him to his eccentric family's sprawling estate for a summer never to be forgotten.",
        "Genre": {
            "Name": "Dark Comedy",
            "Description": "The dark comedy subgenre, also known as black comedy, combines humor with elements of tragedy, morbidity, or darker themes. " 
        },
        "Director": {
            "Name": "Emerald Fennell",
            "Bio": "Emerald Lilly Fennell is an English actress, filmmaker, and writer. She has received many awards and nominations, including an Academy Award, two British Academy Film Awards, one Screen Actors Guild Award, and nominations for three Primetime Emmy Awards and three Golden Globe Awards. ",
            "Birth": "October 1, 1985" 
        },
        "ImageURL":"https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Emerald_Fennell25-03-2013_MarkJones_%28cropped%29.jpg/1200px-Emerald_Fennell25-03-2013_MarkJones_%28cropped%29.jpg",
        "Featured":false
    } 
];
// static request
app.use(express.static('public'));

// CREATE new user
app.post('/users', (req, res) => {
    const newUser = req.body;
  
    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('users need names')
    }
  });

// UPDATE the username of a user
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;
  
    let user = users.find( user => user.id == id );

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user');
    }
  });

// CREATE Allow users to add a movie to their list of favorites
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
  
    let user = users.find( user => user.id == id );

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
    } else {
        res.status(400).send('no such user');
    }
  });

// READ
app.get('/', (req, res) => {
    res.send('Welcome to my movie club!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

// READ list of data about ALL movies
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

// READ data about a single movie, by title
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find( movie => movie.Title === title );

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('no such movie')
    }
});

// READ the genre of a movie
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.Genre.Name == genreName ).Genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('no such genre')
    }
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