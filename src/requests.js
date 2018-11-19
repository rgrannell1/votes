
'use strict'

const request = require('request-promise-native')
const model = require('./model')

const requests = {}

requests.getVotes = async () => {
  const data = await request({
    url: 'https://api.oireachtas.ie/v1/divisions',
    json: true,
    qs: {
      chamber: 'dail'
    }
  })

  return data.results.map(model.asVoteData)
}

requests.getMembers = async () => {
  const data = await request('https://api.oireachtas.ie/v1/members', {
    json: true
  })

  return data.results.map(model.asMember)
}

module.exports = requests
