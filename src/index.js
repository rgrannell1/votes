
'use strict'

const request = require('request-promise-native')

const model = {}

model.asVoteData = data => {
  const {division} = data

  const tallies = {
    yes: division.tallies.taVotes.members.map(member => member.member.showAs),
    no: division.tallies.nilVotes.members.map(member => member.member.showAs)
  }

  const output = {
    isBill: division.isBill,
    chamber: division.chamber.showAs,
    house: division.house.showAs,
    outcome: division.outcome,
    tallies,
    debate: division.debate.showAs
  }

  return output
}

model.asMember = data => {
  console.log(data)
}

const requests = {}

requests.getVotes = async () => {
  const data = await request('https://api.oireachtas.ie/v1/divisions', {
    json: true
  })

  return data.results.map(model.asVoteData)
}

requests.getMembers = async () => {
  const data = await request('https://api.oireachtas.ie/v1/members', {
    json: true
  })

  return data.results.map(model.asMember)
}

const analyses = {}

analyses.votesPerMember = async () => {
  const members = await requests.getMembers()
  const votes = await requests.getVotes()
  const coallated = {}

  console.log(JSON.stringify(members, null, 2))

  votes.map(vote => {
    for (let opt of ['yes', 'no']) {
      for (let member of vote.tallies[opt]) {
        if (!coallated[member]) {
          coallated[member] = {
            votes: {
              yes: new Set([]),
              no: new Set([])
            }
          }
        }

        coallated[member].votes[opt].add(vote.debate)
      }
    }
  })

  for (const member of Object.keys(coallated)) {
    for (const opt of ['yes', 'no']) {
      coallated[member].votes[opt] = Array.from(coallated[member].votes[opt]).sort()
    }
  }

  return coallated
}

const main = async () => {
  analyses.votesPerMember()
}

main()
