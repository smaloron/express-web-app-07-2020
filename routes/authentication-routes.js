const router = require('express').Router();

const userDAO = require('../models/user-model');
const bcrypt = require('bcrypt');

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const pass = await bcrypt.hash(req.body.pass, 2);

  // Création d'un objet user
  const user = {
    user_name: req.body.name,
    email: req.body.email,
    user_password: pass,
  };

  // Sauvegarde de l'utilisateur
  const result = await userDAO.insertOne(user);

  // stockage de l'id généré par l'insertOne dans l'objet user
  user.id = result.insertId;

  // Destruction des infos confidentielles
  delete user.user_password;

  // Enregistrement de l'utilisateur en session
  req.session.user = user;

  // Enregistrement d'une info en session
  req.flash('infos', 'Inscription terminée');

  // redirection
  await res.redirect('/message/new');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  let ok = false;
  //Recherche d'un utilisateur en fonction de son email
  const user = await userDAO.findOneBy('email', req.body.email);

  if (user && 'user_password' in user) {
    // Comparaison du mot de passe saisi avec celui de l'utilisateur
    ok = await bcrypt.compare(req.body.pass, user.user_password);
  }

  if (ok) {
    // Recréation d'un nouvel id de session
    req.session.regenerate(() => {
      req.flash('infos', 'Authentification réussie');
      req.session.user = user;
      res.redirect('/message/new');
    });
  } else {
    req.flash('errors', 'Vos infos de connexion sont incorrectes');
    res.redirect('/login');
  }
});

router.get('/logout', (req, res) => {
  req.session.regenerate(() => {
    // Suppression de la session
    req.session.destroy(() => {
      res.clearCookie('souviensToi');
      res.redirect('/home?logout=true');
    });
  });
});

module.exports = router;
