const {clientConnection} = require('./connection')

module.exports = {
  insert: user => {
    const sql = `
      INSERT INTO perfilme.user
        (name, password, email)
      VALUES
        ($1, $2, $3)
      RETURNING 
        id, name, password, email;
    `
    const params = [user.name, user.password, user.email]
    return clientConnection.one(sql, params)
  },

  findByEmail: email => {
    const sql = `
      SELECT 
        id, name, password, email
      FROM 
        perfilme.user
      WHERE email = $1;
    `
    const param = [email]
    return clientConnection.oneOrNone(sql ,param)
  }
}