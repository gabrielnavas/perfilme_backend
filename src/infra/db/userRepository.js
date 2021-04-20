const { clientConnection } = require('./connection')
const { dateUTC, timestampToDate } = require('../date')


module.exports = {
  insert: async ({name, password, email}) => {

    const result = await clientConnection.tx(async t => {
      const sqlInsert = `
        INSERT INTO perfilme.user
          (id, name, username, password, email, created_at)
        VALUES
          ($1, $2, $3, $4, $5, $6)
        RETURNING 
          id, 
          name, 
          password, 
          username,
          email, 
          created_at;
      `
      const sqlCurrenctIdUser = "SELECT nextval('perfilme.user_id_seq') currect_id"
      const resultCurrenctIdUser = await t.one(sqlCurrenctIdUser)
      const idUser = resultCurrenctIdUser.currect_id
      const username = `${name}${idUser}`
      const createdAt = dateUTC()
      const params = [idUser, name, username, password, email, createdAt]
      return clientConnection.one(sqlInsert, params)
    })
    .then(result => ({
        id: result.id,
        name: result.name, 
        userName: result.username, 
        password: result.password,
        email: result.email, 
        createdAt: timestampToDate(result.created_at)
    }))
    .catch(error => {
      console.log(error);
    })
    return result
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