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

messageDAO.findAllByAuthor = async authorName => {
  const sql = `SELECT 
              m.id, m.parent_id,
              COALESCE(m.title, CONCAT('Réponse à ', parent.title)) as title
              FROM messages as m 
              INNER JOIN users as u ON u.id = m.user_id
              LEFT JOIN messages as parent on parent.id = m.parent_id
              WHERE u.user_name = ?`;
  const results = await messageDAO.query(sql, [authorName]);

  return results[0];
};

module.exports = messageDAO;
