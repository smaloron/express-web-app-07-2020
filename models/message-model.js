const { DAO } = require('./dao');

const messageDAO = new DAO('messages');
messageDAO.findAll = async () => {
  const result = await messageDAO.query('SELECT * FROM view_message');
  return result[0];
};

messageDAO.findAllFirstLevel = async () => {
  const result = await messageDAO.query(
    'SELECT * FROM view_message WHERE parent_id IS NULL  ORDER BY created_at DESC'
  );
  return result[0];
};

messageDAO.findAllAnswers = async id => {
  const result = await messageDAO.query(
    'SELECT * FROM view_message WHERE parent_id=? ORDER BY created_at DESC',
    [id]
  );
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
