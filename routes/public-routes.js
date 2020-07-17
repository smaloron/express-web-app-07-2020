const router = require('express').Router();
const messageDAO = require('../models/message-model');

router.get('/home', async (req, res) => {
  const data = await messageDAO.findAll();
  await res.render('home', {
    messageList: data,
  });
});

router.get('/message/:id([0-9]+)', async (req, res) => {
  const messageData = await messageDAO.findOneById(req.params.id);

  await res.render('messages/details', {
    message: messageData,
  });
});

module.exports = router;
