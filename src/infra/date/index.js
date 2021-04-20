const dateUTC = () => {
  const dateUTC = new Date()
  return dateUTC
}

const timestampToDate = timestampStr => {
  const dateUTC = new Date(timestampStr)
  return dateUTC
}

module.exports = { 
  dateUTC, 
  timestampToDate 
}