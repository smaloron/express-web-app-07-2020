const router = require('express').Router();
const messageDAO = require('../models/message-model');
const userDAO = require('../models/user-model');

const uploadPhoto = require('../middlewares/upload').singlePhoto;

router.get('/home', async (req, res) => {
  const data = await messageDAO.findAllFirstLevel();
  await res.render('home', {
    messageList: data,
  });
});

router.get('/message/:id([0-9]+)', async (req, res) => {
  const messageData = await messageDAO.findOneById(req.params.id);
  const answers = await messageDAO.findAllAnswers(req.params.id);

  await res.render('messages/details', {
    message: messageData,
    answers: answers,
    formTitle: 'Laisser un commentaire',
    islogged: typeof req.session.user != 'undefined',
  });
});

router.post('/message/:id([0-9]+)', [uploadPhoto], async (req, res) => {
  const id = req.params.id;

  // Validation de la saisie
  let ok = true;
  errors = [];

  if (req.body.content.length <= 15) {
    ok = false;
    errors.push('Le texte doit faire plus de 15 caractères');
  }

  if (req.fileTypeError) {
    errors.push(req.fileTypeError);
    ok = false;
  }

  if (ok) {
    // Création d'un objet message
    const message = {
      content: req.body.content,
      user_id: req.session.user.id,
      created_at: new Date(),
      picture: req.uploadedFileName || null,
      parent_id: id,
    };
    // Enregistrement dans la BD
    const result = await messageDAO.insertOne(message);

    req.flash('infos', 'Votre commentaire est enregistré');

    res.redirect('/message/' + id);
  } else {
    const messageData = await messageDAO.findOneById(id);
    const answers = await messageDAO.findAllAnswers(id);

    await res.render('messages/details', {
      message: messageData,
      answers: answers,
      formTitle: 'Laisser un commentaire',
      islogged: typeof req.session.user != 'undefined',
      errorList: errors,
      input: req.body,
    });
  }
});

router.get('/users-messages', async (req, res) => {
  const userList = await userDAO.findAllWithMessageCount();
  res.render('user-messages', {
    userList,
  });
});

router.get('/messages-by-:name', async (req, res) => {
  const data = await messageDAO.findAllByAuthor(req.params.name);
  res.render('messages/by-author', {
    messageList: data,
    author: req.params.name,
  });
});

module.exports = router;
