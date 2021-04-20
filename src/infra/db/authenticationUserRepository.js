const { clientConnection } = require("./connection")
const { dateUTC } = require('../date')

module.exports = {
  updateTokenUserRepository: async ({userIdToInvalidateToken, tokenAuthValid}) => {
    const result = await clientConnection.tx(async tx => {
      const sqlUpdateToken = `
        UPDATE 
          perfilme.authentication_token
        SET 
          invalidated_at = $1
        WHERE
          id_user = $2;
      `
      const dateNow = dateUTC()
      const paramsUpdate = [dateNow, userIdToInvalidateToken]
      await tx.none(sqlUpdateToken, paramsUpdate)

      const sqlInsertToken = `
        INSERT INTO perfilme.authentication_token
          (id_user, token, created_at)
        VALUES
          ($1, $2, $3)
        RETURNING
          id, id_user, token, created_at;
      `
      const paramsInsert = [userIdToInvalidateToken, tokenAuthValid, dateNow]
      return await tx.one(sqlInsertToken, paramsInsert)
    })
    .then(result => ({
      id: result.id, 
      userId: result.id_user, 
      token: result.token, 
      createdAt: result.created_at
    }))
    .catch(error => {
      throw error
    })
    return result
  }
}