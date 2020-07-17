const { DAO } = require('./dao');

const messageDAO = new DAO('messages');
messageDAO.findAll = async () => {
  const result = await messageDAO.query('SELECT * FROM view_message');
  return result[0];
};

messageDAO.findOneById = async id => {
  const result = await messageDAO.query(
    'SELECT * FROM view_message WHERE id=?',
    [id]
  );

  return result[0][0];
};

module.exports = messageDAO;
