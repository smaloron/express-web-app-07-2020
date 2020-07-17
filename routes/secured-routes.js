const router = require('express').Router();
const messageDAO = require('../models/message-model');

const uploadPhoto = require('../middlewares/upload').singlePhoto;

router.use((req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/register');
  }
});

router.get('/message/new', (req, res) => {
  res.render('messages/form');
});

router.post('/message/new', [uploadPhoto], async (req, res) => {
  // Validation de la saisie
  let ok = true;
  errors = [];
  if (req.body.title.length <= 5) {
    ok = false;
    errors.push('Le titre doit faire plus de 5 caractères');
  }
  if (req.body.content.length <= 15) {
    ok = false;
    errors.push('Le texte doit faire plus de 15 caractères');
  }

  if (ok) {
    // Création d'un objet message
    const message = {
      content: req.body.content,
      title: req.body.title,
      user_id: req.session.user.id,
      created_at: new Date(),
      picture: req.uploadedFileName || null,
    };
    // Enregistrement dans la BD
    const result = await messageDAO.insertOne(message);

    req.flash('infos', 'Votre message est enregistré');

    res.redirect('/home');
  } else {
    res.render('messages/form', {
      errorList: errors,
      input: req.body,
    });
  }
});

module.exports = router;
