
'use strict'

const request = require('request-promise-native')

const model = {}

model.asVoteData = data => {
  const {division} = data

  const tallies = {
    yes: division.tallies.taVotes.members.map(member => member.member.memberCode),
    no: division.tallies.nilVotes.members.map(member => member.member.memberCode)
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
  const {memberships} = data.member
  const output = {
    id: data.member.memberCode,
    name: data.member.fullName,
    dates: data.member.dateRange
  }

  output.roles = memberships.map(membership => {
    return {
      represents: membership.membership.represents.map(data => data.represent.showAs),
      parties: membership.membership.parties.map(party => party.party.partyCode)
    }
  })

  return output
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
  const votes = await requests.getVotes()
  const members = await requests.getMembers()
  const coalated = {}

  votes.map(vote => {
    for (let opt of ['yes', 'no']) {
      for (let member of vote.tallies[opt]) {
        if (!coalated[member]) {
          coalated[member] = {
            votes: {
              yes: new Set([]),
              no: new Set([])
            }
          }
        }

        coalated[member].votes[opt].add(vote.debate)
      }
    }
  })

  for (const member of Object.keys(coalated)) {
    for (const opt of ['yes', 'no']) {
      coalated[member].votes[opt] = Array.from(coalated[member].votes[opt]).sort()
    }
  }

  return coalated
}

const main = async () => {
  analyses.votesPerMember()
}

main()
