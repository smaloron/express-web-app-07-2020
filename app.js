const express = require('express');
const app = express();

const bodyParser = require('body-parser');

// Import du module session
const session = require('express-session');
// Stockage des sessions dans un fichier
const fileStorage = require('session-file-store')(session);

const flash = require('express-flash-messages');

const uploadPhoto = require('./middlewares/upload').singlePhoto;

// Rend disponible le contenu du dossier
// public à la racine du site
app.use(express.static('public'));

app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));
app.use('/jquery', express.static('./node_modules/jquery/dist'));
app.use('/photos', express.static('./uploads'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(uploadPhoto);

// Middleware pour la gestion des sessions
app.use(
  session({
    secret: 'Il y a loin de la coupe aux lèvres',
    name: 'souviensToi',
    store: new fileStorage(),
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());

// Gestion des vues
app.set('views', './views');
app.set('view engine', 'pug');

// middleware qui exporte l'utilisateur en session pour PUG
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.use((req, res, next) => {
  if (req.query.logout) {
    req.flash('infos', 'Vous êtes déconnecté');
  }
  next();
});

app.use(require('./routes/public-routes'));
app.use(require('./routes/authentication-routes'));
app.use(require('./routes/secured-routes'));

app.use(function (err, req, res, next) {
  console.log(err);
  if (err.code !== 'EBADCSRFTOKEN') return next(err);
  res.status(403).json({
    message: 'Passez par le formulaire',
  });
});

app.use((err, req, res, next) => {
  res.status(500);
  res.render('error', {
    pageTitle: 'Erreur',
    errorMessage: err.message || err,
  });
});

app.listen(3000, () => {
  console.log('Express server started');
});
