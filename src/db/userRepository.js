const {clientConnection} = require('./connection')

module.exports = {
  insert: async user => {
    const sql = `
      INSERT INTO perfilme.user
        (name, password, email)
      VALUES
        ($1, $2, $3)
      RETURNING 
        id, name, password, email;
    `
    const params = [user.name, user.password, user.email]
    return await clientConnection.one(sql, params)
  }
}