const { DAO } = require('./dao');

const userDAO = new DAO('users');

userDAO.findAllWithMessageCount = async () => {
  const results = await userDAO.query(`
        SELECT user_name, count(messages.id) as message_count FROM users
        LEFT JOIN messages ON users.id = messages.user_id
        GROUP BY users.id`);

  return results[0];
};

module.exports = userDAO;
